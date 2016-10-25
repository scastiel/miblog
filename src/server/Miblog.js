
import path from 'path';
import fs from 'fs-promise';
import fse from 'fs-extra';
import PostFactory from './PostFactory';
import PostRouter from './PostRouter';
import marked from 'marked';
import pug from 'pug';

export default class Miblog {
    constructor(config) {
        this.config = config;
    }
    async getPostInfosFromFile(jsonFile) {
        const postFactory = new PostFactory();
        return await postFactory.createPostFromJsonFile(jsonFile);
    }
    async getPostsInfos() {
        const files = await fs.readdir(this.postsDirectory);
        const postsJsonFiles = files.filter(filename => filename.match(/\.json$/));
        const postFactory = new PostFactory();
        const postsInfos = await Promise.all(postsJsonFiles.map(async jsonFile => {
            return await postFactory.createPostFromJsonFile(path.join(this.postsDirectory, jsonFile));
        }));
        postsInfos.sort((post1, post2) => post1.date.isBefore(post2.date));
        return postsInfos;
    }
    handleError(res, err) {
        console.error(err.stack);
        res.status(500).render('500', { ... this.commonInfos });
    }
    async generate(outputDirectory) {
        const { baseUrl, title, description, footer, postsDirectory, publicDirectory , disqusId, analyticsId } = this.config;
        this.commonInfos = {
            baseUrl,
            title,
            description: marked(description),
            footer: marked(footer),
            disqusId,
            analyticsId
        };
        this.postsDirectory = postsDirectory;
        this.postsInfos = await this.getPostsInfos();

        const postRouter = new PostRouter(this.postsInfos);
        const viewsDirectory = path.join(__dirname, '..', '..', 'views');

        // Posts list pages
        const pages = Array
            .apply(null, { length: Math.floor(this.postsInfos.length / postRouter.nbPostsPerPage) + 1 })
            .map(Number.call, Number);
        const postsListCompileFunction = pug.compileFile(path.join(viewsDirectory, 'posts.pug'));
        const postsListsHtml = await Promise.all(
            pages.map(
                async page => ({
                    file: page === 0 ? 'index.html' : `page-${page + 1}.html`,
                    content: postsListCompileFunction({
                        ... await postRouter.listPosts({ fromPost: page * postRouter.nbPostsPerPage }),
                        ... this.commonInfos
                    })
                })
            )
        );

        // Posts pages
        const postCompileFunction = pug.compileFile(path.join(viewsDirectory, 'post.pug'));
        const postsHtmls = await Promise.all(
            this.postsInfos.map(
                async post => ({
                    directory: 'posts',
                    file: `${post.id}.html`,
                    content: postCompileFunction({
                        ... await postRouter.showPost(post.id),
                        ... this.commonInfos
                    })
                })
            )
        );

        const filesToCopy = [
            {
                basePath: path.join(__dirname, '..', 'client'),
                directory: 'css',
                path: 'app.css'
            }
        ];
        if (publicDirectory) {
            const pathParts = publicDirectory.split(path.sep);
            filesToCopy.push({
                basePath: pathParts.slice(0, pathParts.length - 1).join(path.sep),
                path: pathParts[pathParts.length - 1]
            });
        }

        const allFiles = [ ... postsListsHtml, ... postsHtmls ];
        const directories = [ ... allFiles, ... filesToCopy ]
            .reduce(
                (acc, fileObject) =>
                    !fileObject.directory || acc.includes(fileObject.directory)
                        ? acc : [ ... acc, fileObject.directory ],
                []
            )
            .map(directory => path.join(outputDirectory, directory));
        for (let directory of directories) {
            console.log(`Creating directory ${directory}...`);
            await this.promisify(::fse.mkdirs)(directory);
        }
        for (let fileObject of allFiles) {
            const filePath = fileObject.directory
                ? path.join(outputDirectory, fileObject.directory, fileObject.file)
                : path.join(outputDirectory, fileObject.file);
            console.log(`Creating ${filePath}...`);
            await fs.writeFile(filePath, fileObject.content, 'utf-8');
        }

        for (let fileObject of filesToCopy) {
            const srcPath = [ fileObject.basePath ];
            const dstPath = [ outputDirectory ];
            if (fileObject.directory) {
                srcPath.push(fileObject.directory);
                dstPath.push(fileObject.directory);
            }
            if (fileObject.path) {
                srcPath.push(fileObject.path);
                dstPath.push(fileObject.path);
            }
            const src = path.join(... srcPath);
            const dst = path.join(... dstPath);
            console.log(`Writing ${dst}...`);
            await this.promisify(::fse.copy)(src, dst);
        }
    }
    promisify(f) {
        return (... args) => new Promise((resolve, reject) => {
            f(... args, (err, ... resArgs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(... resArgs);
                }
            })
        })
    }
}

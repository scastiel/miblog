
import path from 'path';
import fs from 'fs-promise';
import PostFactory from './PostFactory';
import HtmlGenerator from './HtmlGenerator';
import FileWriter from './FileWriter';
import promiseSeq from './util/promiseSeq';
import marked from 'marked';

export default class Miblog {
    constructor(config) {
        this.config = config;
    }
    async getPosts() {
        const files = await fs.readdir(this.config.postsDirectory);
        const postsJsonFiles = files.filter(filename => filename.match(/\.json$/));
        const postFactory = new PostFactory();
        const posts = await Promise.all(postsJsonFiles.map(async jsonFile => {
            return await postFactory.createPostFromJsonFile(path.join(this.config.postsDirectory, jsonFile));
        }));
        posts.sort((post1, post2) => post1.date.isBefore(post2.date));
        return posts;
    }
    getFilesToCopy() {
        const filesToCopy = [
            {
                basePath: path.join(__dirname, '..', 'client'),
                directory: 'css',
                path: 'app.css'
            }
        ];
        if (this.config.publicDirectory) {
            const pathParts = this.config.publicDirectory.split(path.sep);
            filesToCopy.push({
                basePath: pathParts.slice(0, pathParts.length - 1).join(path.sep),
                path: pathParts[pathParts.length - 1]
            });
        }
        return filesToCopy;
    }
    getDirectoriesToCreate(files, outputDirectory) {
        return files
            .reduce(
                (acc, fileObject) =>
                    !fileObject.directory || acc.includes(fileObject.directory)
                        ? acc : [ ... acc, fileObject.directory ],
                []
            )
            .map(directory => path.join(outputDirectory, directory))
    }
    async generate(outputDirectory) {
        const { baseUrl, title, description, footer, disqusId, analyticsId } = this.config;
        const commonInfos = {
            baseUrl,
            title,
            description: marked(description),
            footer: marked(footer),
            disqusId,
            analyticsId
        };
        const viewsDirectory = path.join(__dirname, '..', '..', 'views');
        const posts = await this.getPosts();

        const htmlGenerator = new HtmlGenerator(posts, viewsDirectory, commonInfos, this.config.nbPostsPerPage);
        const fileWriter = new FileWriter(outputDirectory);

        const filesToCreate = await htmlGenerator.getAllFilesToGenerate(posts);
        const filesToCopy = this.getFilesToCopy();
        const directories = this.getDirectoriesToCreate([ ... filesToCreate, ... filesToCopy ], outputDirectory);

        await promiseSeq(directories.map(directory => async () => await fileWriter.createDirectory(directory)));
        await promiseSeq(filesToCreate.map(file => async () => await fileWriter.writeFile(file)));
        await promiseSeq(filesToCopy.map(file => async () => await fileWriter.copyFile(file)));
    }
}

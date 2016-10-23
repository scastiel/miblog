
import path from 'path';
import express from 'express';
import fs from 'fs-promise';
import PostFactory from './PostFactory';
import PostRouter from './PostRouter';
import marked from 'marked';

export default class Nblog {
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
    async main({ baseUrl, title, description, footer, postsDirectory, publicDirectory , disqusId }) {
        this.commonInfos = {
            baseUrl,
            title,
            description: marked(description),
            footer: marked(footer),
            disqusId
        };
        this.postsDirectory = postsDirectory;
        this.postsInfos = await this.getPostsInfos();

        const app = express();
        const port = process.env.PORT || 3000;
        const postRouter = new PostRouter(this.postsInfos);
        app.set('views', path.join(__dirname, '..', '..', 'views'));
        app.set('view engine', 'pug');

        app.use('/public', express.static(publicDirectory));
        app.use(express.static(path.join(__dirname, '..', 'client')));

        const routes = {
            '/': req => postRouter.listPosts({ fromPost: parseInt(req.query.fromPost) || 0 }),
            '/posts/:postId': req => postRouter.showPost(req.params.postId)
        };

        Object.keys(routes).forEach(routePath => {
            app.get(routePath, async (req, res) => {
                try {
                    const { error, view, data } = await routes[routePath](req);
                    if (error) {
                        res.status(error);
                    }
                    res.render(view, { ... this.commonInfos, ... data });
                } catch (err) {
                    this.handleError(res, err);
                }
            });
        });

        app.use((req, res) => {
            res.status(404).render('404', { ... this.commonInfos });
        });

        app.use((err, req, res, next) => {
            this.handleError(res, err);
            next(err);
        });

        app.listen(port, () => {
            console.log(`Application running on port ${port}.`); //eslint-disable-line
        });
    }
}

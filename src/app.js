
import path from 'path';
import express from 'express';
import fs from 'fs-promise';
import PostFactory from './PostFactory';
import PostRouter from './PostRouter';

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
        postsInfos.sort((post1, post2) => post1.date < post2.date);
        return postsInfos;
    }
    handleError(res, err) {
        console.error(err.stack);
        res.status(500).render('500', { title: this.title });
    }
    async main({ title, postsDirectory }) {
        this.title = title;
        this.postsDirectory = postsDirectory;
        this.postsInfos = await this.getPostsInfos();

        const app = express();
        const port = process.env.PORT || 3000;
        const postRouter = new PostRouter(this.postsInfos);
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'pug');

        const routes = {
            '/': req => postRouter.listPosts({ fromPost: req.query.fromPost }),
            '/posts/:postId': req => postRouter.showPost(req.params.postId)
        };

        Object.keys(routes).forEach(routePath => {
            app.get(routePath, (req, res) => {
                try {
                    const { error, view, data } = routes[routePath](req);
                    if (error) {
                        res.status(error);
                    }
                    res.render(view, { title, ... data });
                } catch (err) {
                    this.handleError(res, err);
                }
            });
        });

        app.use((req, res) => {
            res.status(404).render('404', { title: this.title });
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

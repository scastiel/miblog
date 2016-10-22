
import path from 'path';
import express from 'express';
import fs from 'fs-promise';
import PostFactory from './PostFactory';

export default class Nblog {
    async getPostInfosFromFile(jsonFile) {
        const postFactory = new PostFactory();
        return await postFactory.createPostFromJsonFile(jsonFile);
    }
    async getPostsInfos() {
        const files = await fs.readdir(this.postsDirectory);
        const postsJsonFiles = files.filter(filename => filename.match(/\.json$/));
        const postFactory = new PostFactory();
        return await Promise.all(postsJsonFiles.map(async jsonFile => {
            return await postFactory.createPostFromJsonFile(path.join(this.postsDirectory, jsonFile));
        }));
    }
    handleError(res, err) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    }
    async main({ title, postsDirectory }) {
        this.postsDirectory = postsDirectory;
        this.postsInfos = await this.getPostsInfos();

        const app = express();
        const port = process.env.PORT || 3000;
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'pug');
        app.get('/', async (req, res) => {
            try {
                res.render('index', { title, posts: this.postsInfos });
            } catch (err) {
                this.handleError(res, err);
            }
        });
        app.use((err, req, res) => {
            this.handleError(res, err);
        });
        app.listen(port, () => {
            console.log(`Application running on port ${port}.`); //eslint-disable-line
        });
    }
}


import path from 'path';
import express from 'express';
import fs from 'fs-promise';
import gfm from 'github-flavored-markdown';

export default class Nblog {
    async getPostInfosFromFile(jsonFile) {
        const infosFile = path.join(this.postsDirectory, jsonFile);
        const contentFile = infosFile.replace(/\.json$/, '.md');
        const postInfos = JSON.parse(await fs.readFile(infosFile, 'utf8'));
        const markdownContent = await fs.readFile(contentFile, 'utf-8');
        const htmlContent = gfm.parse(markdownContent);
        return {
            ... postInfos,
            infosFile,
            contentFile,
            markdownContent,
            htmlContent
        };
    }
    async getPostsInfos() {
        const files = await fs.readdir(this.postsDirectory);
        const postsJsonFiles = files.filter(filename => filename.match(/\.json$/));
        return await Promise.all(postsJsonFiles.map(::this.getPostInfosFromFile));
    }
    async main({ title, postsDirectory }) {
        this.postsDirectory = postsDirectory;
        this.postsInfos = this.getPostsInfos();

        const app = express();
        const port = process.env.PORT || 3000;
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'pug');
        app.get('/', async (req, res) => {
            const postsInfos = await this.getPostsInfos();
            res.render('index', { title, posts: postsInfos });
        });
        app.listen(port, () => {
            console.log(`Application running on port ${port}.`); //eslint-disable-line
        });
    }
}

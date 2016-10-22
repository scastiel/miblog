
import path from 'path';
import fs from 'fs-promise';
import Post from './Post';

export default class PostFactory {
    /**
     * @param {string} jsonFile
     * @return {Post} post
     */
    async createPostFromJsonFile(jsonFile) {
        const id = path.basename(jsonFile).replace(/\.json/, '');
        const contentFile = jsonFile.replace(/\.json$/, '.md');
        const postInfos = JSON.parse(await fs.readFile(jsonFile, 'utf8'));
        const markdownContent = await fs.readFile(contentFile, 'utf-8');
        return new Post({
            ... postInfos,
            id,
            markdownContent
        });
    }
}

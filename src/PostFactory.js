
import path from 'path';
import fs from 'fs-promise';
import Post from './Post';
import moment from 'moment';

export default class PostFactory {
    /**
     * @param {string} jsonFile
     * @return {Post} post
     */
    async createPostFromJsonFile(jsonFile) {
        const id = path.basename(jsonFile).replace(/\.json/, '');
        const contentFile = jsonFile.replace(/\.json$/, '.md');
        const postInfos = JSON.parse(await fs.readFile(jsonFile, 'utf8'));
        postInfos.date = moment(postInfos.date);
        return new Post({
            ... postInfos,
            id,
            contentFile
        });
    }
}

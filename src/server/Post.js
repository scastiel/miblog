
import marked from 'marked';
import highlight from 'highlight.js';
import fs from 'fs-promise';

marked.setOptions({
    highlight: code => highlight.highlightAuto(code).value
});

export default class Post {
    constructor({ id, title, date, contentFile }) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.contentFile = contentFile;
        this.markdownContent = '';
        this.htmlContent = '';
    }
    async fetchContent() {
        if (!this.markdownContent) {
            this.markdownContent = await fs.readFile(this.contentFile, 'utf-8');
            this.htmlContent = marked(this.markdownContent);
        }
    }
}

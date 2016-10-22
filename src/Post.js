
import marked from 'marked';
import highlight from 'highlight.js';

marked.setOptions({
    highlight: code => highlight.highlightAuto(code).value
});

export default class Post {
    constructor({ id, title, date, markdownContent }) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.markdownContent = markdownContent;
    }
    get htmlContent() {
        if (!this._htmlContent) {
            this._htmlContent = marked(this.markdownContent);
        }
        return this._htmlContent;
    }
}

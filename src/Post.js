
import gfm from 'github-flavored-markdown';

export default class Post {
    constructor({ id, title, date, markdownContent }) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.markdownContent = markdownContent;
    }
    get htmlContent() {
        if (!this._htmlContent) {
            this._htmlContent = gfm.parse(this.markdownContent);
        }
        return this._htmlContent;
    }
}


import gfm from 'github-flavored-markdown';

export default class Post {
    constructor({ title, date, markdownContent }) {
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

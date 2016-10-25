
import pug from 'pug';
import path from 'path';

export default class HtmlGenerator {
    static NB_POSTS_PER_PAGE = 5;
    constructor(posts, viewsDirectory, commonInfos, nbPostsPerPage = HtmlGenerator.NB_POSTS_PER_PAGE) {
        this.posts = posts;
        this.viewsDirectory = viewsDirectory;
        this.commonInfos = commonInfos;
        this.nbPostsPerPage = nbPostsPerPage;
    }
    async getPostsListsHtml() {
        const pages = Array
            .apply(null, { length: Math.floor(this.posts.length / this.nbPostsPerPage) + 1 })
            .map(Number.call, Number);
        const postsListCompileFunction = pug.compileFile(path.join(this.viewsDirectory, 'posts.pug'));
        return await Promise.all(pages.map(async page => ({
            file: page === 0 ? 'index.html' : `page-${page + 1}.html`,
            content: postsListCompileFunction({
                ... await this.listPosts({ fromPost: page * this.nbPostsPerPage }),
                ... this.commonInfos
            })
        })));
    }
    async getPostsHtml() {
        const postCompileFunction = pug.compileFile(path.join(this.viewsDirectory, 'post.pug'));
        return await Promise.all(this.posts.map(async post => ({
            directory: 'posts',
            file: `${post.id}.html`,
            content: postCompileFunction({
                ... await this.showPost(post.id),
                ... this.commonInfos
            })
        })));
    }
    async getAllFilesToGenerate(posts) {
        return [
            ... await this.getPostsListsHtml(posts),
            ... await this.getPostsHtml(posts)
        ];
    }
    async listPosts({ fromPost = 0 }) {
        const posts = this.posts.slice(fromPost, fromPost + this.nbPostsPerPage);
        let moreRecentPostsLink;
        let olderPostsLink;
        if (fromPost > 0) {
            const moreRecentPostsLinksFromPost = Math.max(0, fromPost - this.nbPostsPerPage);
            const pageNumber = moreRecentPostsLinksFromPost / this.nbPostsPerPage + 1;
            moreRecentPostsLink = pageNumber === 1 ? '/' : `/page-${pageNumber}.html`;
        }
        if (fromPost + this.nbPostsPerPage < this.posts.length) {
            const pageNumber = (fromPost + this.nbPostsPerPage) / this.nbPostsPerPage + 1;
            olderPostsLink = `/page-${pageNumber}.html`;
        }
        await Promise.all(posts.map(p => p.fetchContent()));
        return { posts, moreRecentPostsLink, olderPostsLink };
    }
    async showPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            return { error: 404, view: 'invalid-post' };
        } else {
            await post.fetchContent();
            return { post };
        }
    }
}

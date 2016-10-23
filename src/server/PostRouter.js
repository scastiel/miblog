
export default class PostRouter {
    static NB_POSTS_PER_PAGE = 2;
    constructor(posts = [], { nbPostsPerPage = PostRouter.NB_POSTS_PER_PAGE } = {}) {
        this.posts = posts;
        this.nbPostsPerPage = nbPostsPerPage;
    }
    async listPosts({ fromPost = 0 }) {
        const posts = this.posts.slice(fromPost, fromPost + this.nbPostsPerPage);
        let moreRecentPostsLink;
        let olderPostsLink;
        if (fromPost > 0) {
            const moreRecentPostsLinksFromPost = Math.max(0, fromPost - this.nbPostsPerPage);
            moreRecentPostsLink = moreRecentPostsLinksFromPost === 0 ? '?' : `?fromPost=${moreRecentPostsLinksFromPost}`;
        }
        if (fromPost + this.nbPostsPerPage < this.posts.length) {
            olderPostsLink = `?fromPost=${fromPost + this.nbPostsPerPage}`;
        }
        await Promise.all(posts.map(p => p.fetchContent()));
        return { view: 'posts', data: { posts, moreRecentPostsLink, olderPostsLink } };
    }
    async showPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            return { error: 404, view: 'invalid-post' };
        } else {
            await post.fetchContent();
            return { view: 'post', data: { post } };
        }
    }
}

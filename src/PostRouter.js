
export default class PostRouter {
    constructor(posts = [], { nbPostsPerPage = 10 } = {}) {
        this.posts = posts;
        this.nbPostsPerPage = nbPostsPerPage;
    }
    async listPosts({ fromPost = 0 }) {
        const posts = this.posts.slice(fromPost, this.nbPostsPerPage);
        await Promise.all(posts.map(p => p.fetchContent()));
        return { view: 'posts', data: { posts } };
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

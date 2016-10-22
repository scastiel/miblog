
export default class PostRouter {
    constructor(posts = [], { nbPostsPerPage = 10 } = {}) {
        this.posts = posts;
        this.nbPostsPerPage = nbPostsPerPage;
    }
    listPosts({ fromPost = 0 }) {
        const posts = this.posts.slice(fromPost, this.nbPostsPerPage);
        return { view: 'posts', data: { posts } };
    }
    showPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            return { error: 404, view: 'invalid-post' };
        } else {
            return { view: 'post', data: { post } };
        }
    }
}

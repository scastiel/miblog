
export default class PostRouter {
    constructor(posts = [], { nbPostsPerPage = 10 } = {}) {
        this.posts = posts;
        this.nbPostsPerPage = nbPostsPerPage;
    }
    listPosts({ fromPost = 0 }) {
        const posts = this.posts.slice(fromPost, this.nbPostsPerPage);
        return { view: 'posts', data: { posts } };
    }
}

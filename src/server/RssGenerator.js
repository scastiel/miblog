
import RSS from 'rss';

export default class RssGenerator {
    generateRssXmlFromPosts(posts, commonInfos) {
        const feed = new RSS(this.getFeedInfos(commonInfos));
        posts.forEach(post => feed.item(this.getPostInfos(post, commonInfos)));
        return feed.xml();
    }
    getFeedInfos(commonInfos) {
        return {
            title: commonInfos.title,
            description: commonInfos.description,
            feed_url: commonInfos.baseUrl + '/rss.xml',
            site_url: commonInfos.baseUrl,
            pubDate: new Date()
        };
    }
    getPostInfos(post, commonInfos) {
        return {
            title: post.title,
            description: post.htmlExcerpt || post.htmlContent,
            url: commonInfos.baseUrl + '/posts/' + post.id + '.html',
            guid: post.id,
            date: post.date
        }
    }
}

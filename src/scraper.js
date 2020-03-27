const mapper = require('./mapper');

const POSTS_PER_PAGE = 10;
const BASE_POSTS_URL = 'https://9gag.com/v1/group-posts/group/default/type/';
const BASE_COMMENTS_URL = 'https://comment-cdn.9gag.com/v1/topComments.json?appId=a_dd8f2b7d304a10edaf6f29517ea0ca4100a43d1b&urls=http%3A%2F%2F9gag.com%2Fgag%2F';

class Scraper {

  constructor(httpClient, postCount, section = 'hot', commentCount = 0) {
    if(httpClient == undefined) throw new Error('Expected an http client');
    if (postCount <= 0) throw new Error('Post count must be positive');
    if (commentCount < 0) throw new Error('Comment count cannot be negative');
    this.httpClient = httpClient;
    this.postCount = postCount;
    this.section = section;
    this.commentCount = commentCount;
  }

  postsUrl(lastPostId) {
    let url = BASE_POSTS_URL + this.section;
    if (lastPostId) url += '?after=' + lastPostId;
    return url;
  }

  commentsUrl(postId) {
    return `${BASE_COMMENTS_URL}${postId}&order=score&commentL1=${this.commentCount}&commentL2=1`;
  }

  /**
   * Scraps 9gag from the start or continues after some post id
   * 
   * @param {string} [lastPostId] - Last scrapped post id
   */
  async scrap(lastPostId) {
    let result = [];
    const pages = Math.ceil(this.postCount / POSTS_PER_PAGE);
    for (let i = 0; i < pages; i++) {
      let response = await this.httpClient.get(this.postsUrl(lastPostId));
      const posts = mapper.readPosts(response);
      if (this.commentCount) {
        // could be parallel with Promise.all
        for (let post of posts) {
          response = await this.httpClient.get(this.commentsUrl(post.id));
          post.comments = mapper.readComments(response);
        }
      }
      lastPostId = posts[posts.length - 1].id;
      result = result.concat(posts);
    }
    return result.slice(0, this.postCount);
  }

}

module.exports = Scraper;

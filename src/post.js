const Type = require('./type');

class Post {
  constructor(id, url, title, type, nsfw, hasLongPostCover, upVoteCount, commentsCount, content) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.type = type;
    this.nsfw = nsfw;
    this.hasLongPostCover = hasLongPostCover;
    this.upVoteCount = upVoteCount;
    this.commentsCount = commentsCount;
    this.content = content;
    this.comments = [];
  }

  isVideo() {
    return this.type === Type.VIDEO;
  }

}

module.exports = Post;

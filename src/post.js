class Post {
  constructor(id, url, title, type, nsfw, hasLongPostCover, upVoteCount, commentsCount, image) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.type = type;
    this.nsfw = nsfw;
    this.hasLongPostCover = hasLongPostCover;
    this.upVoteCount = upVoteCount;
    this.commentsCount = commentsCount;
    this.image = image;
    this.comments = [];
  }
}

module.exports = Post;

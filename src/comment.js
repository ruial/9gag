class Comment {
  constructor(id, timestamp, user, likes, type, content, reply) {
    this.id = id;
    this.timestamp = timestamp;
    this.user = user;
    this.likes = likes;
    this.type = type;
    this.content = content;
    this.reply = reply;
  }
}

module.exports = Comment;

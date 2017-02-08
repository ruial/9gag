"use strict";
class Comment {
    constructor(username, content, isMedia = false) {
        this.username = username;
        this.content = content;
        this.isMedia = isMedia;
    }
}
exports.Comment = Comment;

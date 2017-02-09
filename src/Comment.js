"use strict";
class Comment {
    constructor(username, text, isMedia = false) {
        this.username = username;
        this.text = text;
        this.isMedia = isMedia;
    }
}
exports.Comment = Comment;

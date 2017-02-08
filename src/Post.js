"use strict";
class Post {
    constructor(id, title, image, video) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.video = video;
        this.comments = [];
    }
    getComments() {
        return this.comments.slice();
    }
    addComment(comment) {
        if (this.comments.length < Post.MAX_COMMENTS) {
            this.comments.push(comment);
        }
    }
    url() {
        return Post.START_URL + this.id;
    }
}
Post.START_URL = "http://9gag.com/gag/";
Post.MAX_COMMENTS = 6;
exports.Post = Post;

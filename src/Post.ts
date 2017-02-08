import { Comment } from "./Comment";

export class Post {

    private comments: Comment[];

    private static START_URL = "http://9gag.com/gag/";
    public static MAX_COMMENTS = 6;

    constructor(public id: string, public title: string, public image: string, public video?: string) {
        this.comments = [];
    }

    getComments() {
        return this.comments.slice();
    }

    addComment(comment: Comment) {
        if (this.comments.length < Post.MAX_COMMENTS) {
            this.comments.push(comment);
        }
    }

    url() {
        return Post.START_URL + this.id;
    }

}
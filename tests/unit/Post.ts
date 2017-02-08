import * as chai from "chai";
const expect = chai.expect;

import { Post } from "../../src/Post";
import { Comment } from "../../src/Comment";


describe("Post", function () {

    let post: Post;
    const comment = new Comment("user", "text");

    beforeEach(function () {
        post = new Post("id", "title", "img");
    });

    it("should save data", function () {
        expect(post.id).to.eql("id");
        expect(post.title).to.eql("title");
        expect(post.image).to.eql("img");
        expect(post.video).to.be.undefined;
    });

    it("should add comments", function () {
        post.addComment(comment);
        expect(post.getComments()).to.eql([comment]);
    });

    it("should now allow to pass the comment limit", function () {
        Post.MAX_COMMENTS = 0;
        post.addComment(comment);
        expect(post.getComments().length).to.eql(0);
    });

    it("should get post url", function () {
        expect(post.url()).to.eql("http://9gag.com/gag/id");
    });

});
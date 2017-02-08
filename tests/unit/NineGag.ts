import * as fse from "fs-extra";
import * as sinon from "sinon";
import * as chai from "chai";
const expect = chai.expect;

import { NineGag } from "../../src/NineGag";
import { Post } from "../../src/Post";
import * as Utils from "../../src/Utils";


describe("NineGag", function () {

    let nineGag: NineGag;
    let post: Post;

    beforeEach(function () {
        nineGag = new NineGag();
        post = new Post("a9rMNVj", "title", "img");
    });

    it("should add posts", function () {
        nineGag.addPost(post);
        expect(nineGag.getPosts()).to.eql([post]);
    });

    it("should not add repeated post", function () {
        nineGag.addPost(post);
        nineGag.addPost(post);
        expect(nineGag.getPosts().length).to.eql(1);
    });

    it("should read posts", async function () {
        // stub the method to load local posts data containing 10 posts
        let readPage = sinon.stub(Utils, "readPage").returns(new Promise(resolve => {
            let html = fse.readFileSync("tests/fixtures/section.html", "utf8");
            return resolve(html);
        }));

        // spy readComments to make sure it is never called
        let readComments = sinon.spy(NineGag.prototype, "readComments");

        await nineGag.readPosts(2);

        readPage.restore();
        readComments.restore();
        sinon.assert.calledTwice(readPage);
        sinon.assert.calledWith(readPage, "http://9gag.com/hot");
        sinon.assert.calledWith(readPage, "http://9gag.com/hot?id=a1bZXeG%2CaEYGyxx%2Ca9rMWEZ&c=10");
        sinon.assert.notCalled(readComments);
        expect(nineGag.getPosts().length).to.eql(10);
        expect(nineGag.getPosts()[0].id).to.eql("aNAoM1v");
    });

    it("should read comments", async function () {
        // stub the method to load local comments data containing some comments
        let readPage = sinon.stub(Utils, "readPage").returns(new Promise(resolve => {
            let html = fse.readFileSync("tests/fixtures/comments.json", "utf8");
            return resolve(html);
        }));

        await nineGag.readComments(post);

        readPage.restore();
        sinon.assert.calledOnce(readPage);
        sinon.assert.calledWith(readPage, "http://comment-cdn.9gag.com/v1/cacheable/comment-list.json?appId=a_dd8f2b7d304a10edaf6f29517ea0ca4100a43d1b&count=10&level=2&order=score&mentionMapping=true&url=http://9gag.com/gag/a9rMNVj");
        expect(post.getComments().length).to.eql(Post.MAX_COMMENTS);
        expect(post.getComments()[0].username).to.eql("tucuquere");
    });

});
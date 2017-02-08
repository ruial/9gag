import * as request from "request";
import * as chai from "chai";
import * as fse from "fs-extra";
const expect = chai.expect;

import { NineGag } from "../../src/NineGag";
import { Post } from "../../src/Post";


describe("NineGag - Integration Test", function () {
    let nineGag: NineGag;

    beforeEach(function () {
        nineGag = new NineGag();
    });

    it("should read 2 pages", async function () {
        await nineGag.readPosts(2);
        expect(nineGag.getPosts().length).to.eql(20);
    });

    it("should read comments", async function () {
        let post = new Post("aM8bqPX", null, null);
        await nineGag.readComments(post);
        expect(post.getComments().length).to.eql(Post.MAX_COMMENTS);
    });

    it("should write output", async function () {
        nineGag.addPost(new Post("idPost", "title", "https://img-9gag-fun.9cache.com/photo/aM8bqPX_700b.jpg"));
        let folder = "tests/output";
        await nineGag.writePage(folder);
        let content = fse.readFileSync(`${folder}/${NineGag.OUTPUT_FILE}`, "utf8");
        expect(content.includes("idPost")).to.be.true;
        expect(content.includes("aM8bqPX_700b.jpg")).to.be.true;
        fse.removeSync(folder);
    });
});

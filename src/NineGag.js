"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cheerio = require("cheerio");
const handlebars = require("handlebars");
const fse = require("fs-extra");
const path = require("path");
const Utils = require("./Utils");
const Comment_1 = require("./Comment");
const Post_1 = require("./Post");
class NineGag {
    constructor() {
        this.posts = [];
    }
    getPosts() {
        return this.posts.slice();
    }
    addPost(post) {
        if (this.validatePost(post)) {
            this.posts.push(post);
        }
    }
    readPosts(maxPages, section = "hot", comments) {
        return __awaiter(this, void 0, void 0, function* () {
            let next = "/" + section;
            for (let i = 0; i < maxPages; i++) {
                let html = yield Utils.readPage(NineGag.URL + next);
                let $ = cheerio.load(html);
                let posts = [];
                // each page contains 10 posts
                $("article").each(function () {
                    let id = $(this).attr("data-entry-id");
                    let title = $(this).find("h2").text().trim();
                    let image = $(this).find("img").attr("src");
                    let media = $(this).find("source").first().attr("src");
                    let post = new Post_1.Post(id, title, image, media);
                    posts.push(post);
                });
                for (let post of posts) {
                    if (comments)
                        yield this.readComments(post);
                    this.addPost(post);
                }
                next = $(".badge-load-more-post").attr("href");
            }
        });
    }
    readComments(post) {
        return __awaiter(this, void 0, void 0, function* () {
            let html = JSON.parse(yield Utils.readPage(`${NineGag.COMMENTS_URL}&url=${post.url()}`));
            html.payload.comments.forEach(comment => {
                post.addComment(new Comment_1.Comment(comment.user.displayName, comment.text, comment.type === "media"));
                if (comment.children.length > 0) {
                    let reply = comment.children[0];
                    post.addComment(new Comment_1.Comment(reply.user.displayName, reply.text, reply.type === "media"));
                }
            });
        });
    }
    writePage(outputFolder = NineGag.OUTPUT_FOLDER) {
        return new Promise(resolve => {
            // delete output folder
            fse.remove(outputFolder, () => {
                // need to create directories if they dont exist
                fse.mkdirp(path.join(outputFolder, NineGag.MEDIA_FOLDER), () => {
                    // copy static files
                    fse.copy(NineGag.STATIC_RESOURCES, path.join(outputFolder, NineGag.STATIC_FOLDER), () => {
                        // download images and videos
                        this.cacheFiles(outputFolder).then(() => {
                            // load template
                            fse.readFile(NineGag.TEMPLATE_FILE, "utf8", (err, data) => {
                                let template = handlebars.compile(data);
                                let result = template(this);
                                // write page
                                fse.writeFile(path.join(outputFolder, NineGag.OUTPUT_FILE), result, () => {
                                    resolve();
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    cacheFiles(outputFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let post of this.posts) {
                post.image = yield this.cache(post.image, outputFolder);
                post.video = yield this.cache(post.video, outputFolder);
                for (let comment of post.getComments()) {
                    comment.content = yield this.cache(comment.content, outputFolder);
                }
            }
        });
    }
    cache(url, outputFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (url && url.match("^https?://")) {
                let ending = url.substring(url.lastIndexOf("/"));
                let file = NineGag.MEDIA_FOLDER + ending;
                yield Utils.downloadFile(url, path.join(outputFolder, file));
                return file;
            }
            return url;
        });
    }
    validatePost(post) {
        for (let p of this.posts) {
            if (p.id === post.id) {
                return false;
            }
        }
        return true;
    }
}
NineGag.URL = "http://9gag.com";
NineGag.COMMENTS_URL = "http://comment-cdn.9gag.com/v1/cacheable/comment-list.json?appId=a_dd8f2b7d304a10edaf6f29517ea0ca4100a43d1b&count=10&level=2&order=score&mentionMapping=true";
NineGag.OUTPUT_FOLDER = "output";
NineGag.MEDIA_FOLDER = "media";
NineGag.STATIC_FOLDER = "static";
NineGag.OUTPUT_FILE = "page.html";
NineGag.TEMPLATE_FILE = path.join(__dirname, "/../resources/template.handlebars");
NineGag.STATIC_RESOURCES = path.join(__dirname, "/../resources/static");
exports.NineGag = NineGag;

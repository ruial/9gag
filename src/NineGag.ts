import * as cheerio from "cheerio";
import * as handlebars from "handlebars";
import * as fse from "fs-extra";
import * as path from "path";
import * as Utils from "./Utils";
import { Comment } from "./Comment";
import { Post } from "./Post";

interface IComment {
    text: string;
    type: string;
    children: [IComment];
    user: { displayName: string };
}

interface CommentsApi {
    status: string;
    error: string;
    payload: {
        comments: IComment[]
    };
}

export class NineGag {

    private posts: Post[];

    private static URL = "http://9gag.com";
    private static COMMENTS_URL = "http://comment-cdn.9gag.com/v1/cacheable/comment-list.json?appId=a_dd8f2b7d304a10edaf6f29517ea0ca4100a43d1b&count=10&level=2&order=score&mentionMapping=true";
    public static OUTPUT_FOLDER = "output";
    public static MEDIA_FOLDER = "media";
    public static STATIC_FOLDER = "static";
    public static OUTPUT_FILE = "page.html";
    public static TEMPLATE_FILE = path.join(__dirname, "/../resources/template.handlebars");
    public static STATIC_RESOURCES = path.join(__dirname, "/../resources/static");

    constructor() {
        this.posts = [];
    }

    public getPosts() {
        return this.posts.slice();
    }

    public addPost(post: Post) {
        if (this.validatePost(post)) {
            this.posts.push(post);
        }
    }

    public async readPosts(maxPages: number, section = "hot", comments?: boolean) {
        let next = "/" + section;
        for (let i = 0; i < maxPages; i++) {
            let html = await Utils.readPage(NineGag.URL + next);
            let $ = cheerio.load(html);
            let posts: Post[] = [];
            // each page contains 10 posts
            $("article").each(function () {
                let id = $(this).attr("data-entry-id");
                let title = $(this).find("h2").text().trim();
                let image = $(this).find("img").attr("src");
                let media = $(this).find("source").first().attr("src");
                let post = new Post(id, title, image, media);
                posts.push(post);
            });
            for (let post of posts) {
                if (comments) await this.readComments(post);
                this.addPost(post);
            }
            next = $(".badge-load-more-post").attr("href");
        }
    }

    public async readComments(post: Post) {
        let html: CommentsApi = JSON.parse(await Utils.readPage(`${NineGag.COMMENTS_URL}&url=${post.url()}`));
        html.payload.comments.forEach(comment => {
            post.addComment(new Comment(comment.user.displayName, comment.text, comment.type === "media"));
            if (comment.children.length > 0) {
                let reply = comment.children[0];
                post.addComment(new Comment(reply.user.displayName, reply.text, reply.type === "media"));
            }
        });
    }

    public writePage(outputFolder = NineGag.OUTPUT_FOLDER) {
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


    private async cacheFiles(outputFolder: string) {
        for (let post of this.posts) {
            post.image = await this.cache(post.image, outputFolder);
            post.video = await this.cache(post.video, outputFolder);
            for (let comment of post.getComments()) {
                comment.text = await this.cache(comment.text, outputFolder);
            }
        }
    }

    private async cache(url: string, outputFolder: string) {
        if (url && url.match("^https?://")) {
            let ending = url.substring(url.lastIndexOf("/"));
            let file = NineGag.MEDIA_FOLDER + ending;
            await Utils.downloadFile(url, path.join(outputFolder, file));
            return file;
        }
        return url;
    }

    private validatePost(post: Post) {
        for (let p of this.posts) {
            if (p.id === post.id) {
                return false;
            }
        }
        return true;
    }

}
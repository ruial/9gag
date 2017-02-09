# 9gag
A nodejs package to download 9GAG posts and comments.

It can be used as a module to scrap memes or as a command line application to save data to a local folder and generate an HTML file for offline use.

## Install
    npm install 9gag

## Examples
### CLI
    9gag <pages_count> [<folder> default:output] [<section> default:hot] [<comments> default:false]
    9gag 3
    9gag 1 output trending true


### Read Post Titles (TypeScript)
    import { NineGag } from "9gag";

    async function showPostTitles(pages: number) {
        let nineGag = new NineGag();
        await nineGag.readPosts(pages);
        nineGag.getPosts().forEach(post => {
            console.log(post.title);
        });
    };

    showPostTitles(1);


### Read Posts and Comments (ES6 JavaScript)
    const NineGag = require("9gag").NineGag;

    let nineGag = new NineGag();

    nineGag.readPosts(1, "trending", true).then(() => {
        nineGag.getPosts().forEach((post => {
            console.log(post.id + " - " + post.title + " - " + (post.video || post.image) + "\n");
            post.getComments().forEach(comment => {
                console.log("\t" + comment.username + ": " + comment.text);
            });
            console.log("\n------------------\n");
        }));
    });

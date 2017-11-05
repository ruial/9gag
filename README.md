# 9gag
A nodejs package to download 9GAG posts and comments.

It can be used as a module to scrap memes or as a command line application to save data to a local folder and generate an HTML file for offline use.

Node.js 8 or above required due to Async/Await usage.

## Install
    npm install 9gag

## Examples
### CLI
    9gag <post_count> [<folder> default:output] [<section> default:hot] [<comment_count> default:0]
    9gag 10
    9gag 20 output trending 3


### Scrap post titles and images using Async/Await
    const NineGag = require('9gag');
    const Scraper = NineGag.Scraper;

    async function memes() {
        const scraper = new Scraper(10);
        try {
            const posts = await scraper.scrap();
            posts.forEach(post => console.log(`${post.title} -> ${post.content}`));
        }
        catch (err) {
            console.error(err);
        }
    }

    memes();



### Downloading posts and comments using Promises
    const NineGag = require('9gag');
    const Scraper = NineGag.Scraper;
    const Downloader = NineGag.Downloader;


    const scraper = new Scraper(10, 'hot', 3);
    scraper.scrap()
        .then(posts => {
            console.log(posts);
            return new Downloader('output').downloadPosts(posts);
        })
        .then(() => {
            console.log('Finished writing html page.');
        })
        .catch(err => console.error(err));

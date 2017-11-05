#! /usr/bin/env node

const Post = require('./post');
const Comment = require('./comment');
const Type = require('./type');
const mapper = require('./mapper');
const Scraper = require('./scraper');
const Downloader = require('./downloader');

async function main() {
  const postCount = Number(process.argv[2]);
  const outputFolder = process.argv[3];
  const section = process.argv[4];
  const commentCount = Number(process.argv[5]);

  try {
    const scraper = new Scraper(postCount, section, commentCount);
    const posts = await scraper.scrap();
    console.log(posts);

    const downloader = new Downloader(outputFolder);
    await downloader.downloadPosts(posts);
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}


exports.Post = Post;
exports.Comment = Comment;
exports.Type = Type;
exports.mapper = mapper;
exports.Scraper = Scraper;
exports.Downloader = Downloader;

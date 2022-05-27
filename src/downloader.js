const fse = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
const handlebars = require('handlebars');

const STATIC_FOLDER = 'static';
const MEDIA_FOLDER = 'media';
const RESOURCES = path.join(__dirname, '../resources');
const TEMPLATE_PATH = path.join(RESOURCES, 'template.handlebars');
const OUTPUT_FILE = 'index.html';


function downloadFile(url, path) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => {
        res.body.pipe(fse.createWriteStream(path)).on('finish', resolve).on('error', reject);
      })
      .catch(reject);
  });
}


class Downloader {

  constructor(outputFolder = 'output') {
    this.outputFolder = outputFolder;
  }

  /**
   * Download posts and generate an html file
   * 
   * @param {Post[]} posts 
   */
  async downloadPosts(posts) {
    // clean output folder
    await fse.remove(this.outputFolder);
    // create required directory structure
    await /* TODO: JSFIX could not patch the breaking change:
    Creating a directory with fs-extra no longer returns the path 
    Suggested fix: The returned promise no longer includes the path of the new directory */
    fse.mkdirp(path.join(this.outputFolder, MEDIA_FOLDER));
    // copy static files
    await fse.copy(path.join(RESOURCES, STATIC_FOLDER), path.join(this.outputFolder, STATIC_FOLDER));
    // download images and videos
    await this._downloadPosts(posts);
    // load template
    const data = await fse.readFile(TEMPLATE_PATH, 'utf8');
    const template = handlebars.compile(data);
    const result = template({ posts: posts }, { allowedProtoMethods: { isVideo: true, isText: true } });
    // write html page
    await fse.writeFile(path.join(this.outputFolder, OUTPUT_FILE), result);
  }

  async _downloadPosts(posts) {
    for (let post of posts) {
      post.content = await this._downloadMedia(post.content);
      for (let comment of post.comments) {
        comment.content = await this._downloadMedia(comment.content);
        if (comment.reply) comment.reply.content = await this._downloadMedia(comment.reply.content);
      }
    }
  }

  async _downloadMedia(url) {
    if (url && url.match('^https?://')) {
      const ending = url.substring(url.lastIndexOf('/'));
      const file = MEDIA_FOLDER + ending;
      await downloadFile(url, path.join(this.outputFolder, file));
      return file;
    }
    return url;
  }

}

module.exports = Downloader;

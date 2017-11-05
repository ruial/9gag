const fse = require('fs-extra');
const path = require('path');
const axios = require('axios');
const handlebars = require('handlebars');

const STATIC_FOLDER = 'static';
const MEDIA_FOLDER = 'media';
const RESOURCES = path.join(__dirname, '../resources');
const TEMPLATE_PATH = path.join(RESOURCES, 'template.handlebars');
const OUTPUT_FILE = 'index.html';


function downloadFile(url, path) {
  return new Promise((resolve, reject) => {
    axios.get(url, { responseType: 'stream' })
      .then(response => {
        response.data.pipe(fse.createWriteStream(path)).on('close', resolve).on('error', reject);
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
    await fse.mkdirp(path.join(this.outputFolder, MEDIA_FOLDER));
    // copy static files
    await fse.copy(path.join(RESOURCES, STATIC_FOLDER), path.join(this.outputFolder, STATIC_FOLDER));
    // download images and videos
    await this._downloadPosts(posts);
    // load template
    const data = await fse.readFile(TEMPLATE_PATH, 'utf8');
    const template = handlebars.compile(data);
    const result = template({ posts: posts });
    // write html page
    await fse.writeFile(path.join(this.outputFolder, OUTPUT_FILE), result);
  }

  async _downloadPosts(posts) {
    for (let post of posts) {
      post.image = await this._downloadMedia(post.image);
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

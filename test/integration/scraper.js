const chai = require('chai');
const expect = chai.expect;

const Scraper = require('../../src/scraper');
const HttpClient = require('../../src/httpclient');

describe('Scraper Integration Tests', () => {

  let httpClient;

  before(async function() {
    httpClient = new HttpClient();
    await httpClient.init();
  });

  after(async function() {
    await httpClient.close();
  });

  it('should read 12 posts', async function () {
    const posts = await new Scraper(httpClient, 12, 'hot', 0).scrap();
    expect(posts.length).to.eq(12);
  });

  it('should read comments', async function () {
    const posts = await new Scraper(httpClient, 1, 'hot', 2).scrap();
    expect(posts[0].comments.length).to.eq(2);
  });

});

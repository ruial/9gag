const chai = require('chai');
const expect = chai.expect;

const Scraper = require('../../src/scraper');

describe('Scraper Integration Tests', () => {

  it('should read 12 posts', async function () {
    const posts = await new Scraper(12, 'hot', 0).scrap();
    expect(posts.length).to.eq(12);
  });

  it('should read comments', async function () {
    const posts = await new Scraper(1, 'hot', 2).scrap();
    expect(posts[0].comments.length).to.eq(2);
  });

});

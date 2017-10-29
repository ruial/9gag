const chai = require('chai');
const expect = chai.expect;

const mapper = require('../../src/mapper');
const Post = require('../../src/post');
const Comment = require('../../src/comment');

const postFixtures = require('../fixtures/posts');
const commentFixtures = require('../fixtures/comments');


describe('api mapping', () => {

  it('should convert posts', () => {
    const posts = mapper.readPosts(postFixtures);
    expect(posts.length).to.eq(10);
    const firstPost = new Post('aADZZBd', 'http://9gag.com/gag/aADZZBd', 'I need this flash memory',
      'Animated', 0, 0, 5334, 146, 'https://img-9gag-fun.9cache.com/photo/aADZZBd_460sv.mp4');
    expect(posts[0]).to.eql(firstPost);
  });

  it('should convert comments', () => {
    const comments = mapper.readComments(commentFixtures);
    expect(comments.length).to.eq(3);
    const firstComment = new Comment('c_150900597086146363', 1509005970, 'imnotfukindrunk', 441, 'userMedia', 'https://img-comment-fun.9cache.com/media/aGZxvw0/aoKYzPmm_700wv_0.mp4',
      new Comment('c_150911736881282532', 1509117368, 'bob_vagena', 57, 'text', '@imnotfukindrunk comments are better than posts these days'));
    expect(comments[0]).to.eql(firstComment);
  });

});

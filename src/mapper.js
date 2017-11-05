const Post = require('./post');
const Comment = require('./comment');
const Type = require('./type');

function readPost(post) {
  let image;
  let type;
  if (post.type === 'Animated') {
    type = Type.VIDEO;
    image = post.images.image460sv.url;
  }
  else {
    type = Type.IMAGE;
    image = post.images.image460.url;
  }
  return new Post(post.id, post.url, post.title, type, post.nsfw, post.hasLongPostCover, post.upVoteCount, post.commentsCount, image);
}

function readComment(comment) {
  let content;
  let type;
  if (comment.type === 'text') {
    type = Type.TEXT;
    content = comment.mediaText;
  }
  else {
    type = Type.IMAGE;
    const media = comment.type === 'userMedia' ? comment.media[0].imageMetaByType : comment.embedMediaMeta.embedImage;
    content = media.type === 'STATIC' ? media.image.url : media.animated.url;
  }
  let reply = comment.children[0];
  if (reply) reply = readComment(reply);
  return new Comment(comment.commentId, comment.timestamp, comment.user.displayName, comment.likeCount, type, content, reply);
}

function readPosts(postsData) {
  return postsData.data.posts.map(post => {
    return readPost(post);
  });
}

function readComments(commentsData) {
  return commentsData.payload.data[0].comments.map(comment => {
    return readComment(comment);
  });
}


module.exports = {
  readPosts: readPosts,
  readComments: readComments
};

const Post = require('./post');
const Comment = require('./comment');

function readPost(post) {
  const image = post.type === 'Animated' ? post.images.image460sv.url : post.images.image460.url;
  return new Post(post.id, post.url, post.title, post.type, post.nsfw, post.hasLongPostCover, post.upVoteCount, post.commentsCount, image);
}

function readComment(comment) {
  let content;
  if (comment.type === 'text') {
    content = comment.mediaText;
  }
  else {
    const media = comment.media[0].imageMetaByType;
    if (media.type === 'STATIC') {
      content = media.image.url;
    }
    else {
      content = media.video.url || media.animated.url;
    }
  }
  let reply = comment.children[0];
  if (reply) reply = readComment(reply);
  return new Comment(comment.commentId, comment.timestamp, comment.user.displayName, comment.likeCount, comment.type, content, reply);
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

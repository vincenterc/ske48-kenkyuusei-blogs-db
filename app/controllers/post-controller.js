const Post = require('../models/post')
const Member = require('../models/member')

const createPost = async post => {
  let postFound = await Post.find({ identity: post.identity }).exec()
  let memberFound = await Member.find({ identity: post.writerIdentity }).exec()

  if (postFound.length === 0) {
    if (memberFound.length !== 0) {
      let postCreated = new Post({ ...post })
      return postCreated.save().catch(err => console.log(err))
    } else {
      console.log(`Member, ${post.writerIdentity}, is not found.`)
    }
  } else {
    console.log(`Post, ${post.identity}, is already created.`)
  }
}

module.exports = { createPost }

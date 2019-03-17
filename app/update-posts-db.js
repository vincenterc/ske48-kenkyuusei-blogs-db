const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const membersWithKeywords = require('./data/members-with-keywords.json')
const { getLatestPostId, createPost } = require('./controllers/post-controller')
const {
  PostType,
  getPostsInGroupsFromWeb,
  getNextPostIdFromPostPage,
} = require('./helpers/post-helper')

const groupList = ['ken91', 'ken92', 'ken93', 'ken94']

const main = async () => {
  mongoose.connect(dbPath, { useNewUrlParser: true })

  let postIdsLatest = await Promise.all(
    groupList.map(g => getLatestPostId({ group: g }))
  ).then(values => values)

  let initialPostId = await Promise.all(
    postIdsLatest.map(postId => getNextPostIdFromPostPage(postId, PostType.new))
  ).then(values => values)

  let groups = groupList.map((g, idx) => ({
    identity: g,
    initialPostId: initialPostId[idx],
  }))

  let posts = await getPostsInGroupsFromWeb(
    groups,
    PostType.new,
    membersWithKeywords
  )

  posts = await Promise.all(posts.map(p => createPost(p))).then(
    values => values
  )

  console.log(posts.length)

  mongoose.connection.close()
}

main()

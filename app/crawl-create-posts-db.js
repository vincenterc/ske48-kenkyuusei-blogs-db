const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const membersWithKeywords = require('./data/members-with-keywords.json')
const {
  PostType,
  getPostsInGroupsFromWeb,
  getInitialPostIdsFromGroupPages,
} = require('./helpers/post-helper')
const { createPost } = require('./controllers/post-controller')

const groupArray = [
  'kenkyuusei7_1',
  'kenkyuusei7_2',
  'kenkyuusei7_3',
  'kenkyuuseid2',
  'kenkyuuseiall',
  'ken7',
  'ken81',
  'ken82',
  'ken83',
  'ken01',
  'ken02',
  'ken001',
  'draft3',
  'ken91',
  'ken92',
  'ken93',
  'ken94',
]

const main = async () => {
  mongoose.connect(dbPath, { useNewUrlParser: true })

  let initialPostIds = await getInitialPostIdsFromGroupPages(groupArray)
  let groups = groupArray.map((g, idx) => ({
    identity: g,
    initialPostId: initialPostIds[idx],
  }))
  let posts = await getPostsInGroupsFromWeb(
    groups,
    PostType.old,
    membersWithKeywords
  )
  posts = await Promise.all(posts.map(p => createPost(p))).then(
    values => values
  )

  console.log(posts.length)

  // const fs = require('fs')
  // fs.writeFileSync('temp2.json', JSON.stringify(posts, null, 2))

  mongoose.connection.close()
}

main()

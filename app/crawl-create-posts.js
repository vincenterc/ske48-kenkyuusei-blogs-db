const fetch = require('node-fetch')
const cheerio = require('cheerio')
const mongoose = require('mongoose')

const { createPost } = require('./controllers/post-controller')
const members = require('./data/members.json')
const { dbPath } = require('./constants')

const groupArray = ['ken91', 'ken92', 'ken93', 'ken94']
const groupUrl = group => `http://www2.ske48.co.jp/blog/member/writer:${group}`
const postUrl = id => `http://www2.ske48.co.jp/blog/detail/id:${id}`

// Get post id
const PostType = {
  new: 'next',
  old: 'prev',
}

const getNextPostId = async (body, type) => {
  let $ = cheerio.load(body, { decodeEntities: false })
  let href = $(`li.${type} > a`).attr('href')

  return href && href.split('id')[1].slice(1)
}

// Get post
const getPost = body => {
  let $ = cheerio.load(body, { decodeEntities: false })
  let title = $('div#blog_detail > h3').html()
  let date = $('div#blog_detail > time').html()
  let content = $('div#blog_detail').html()

  return { title, date, content }
}

const getWriter = (members, post) => {
  const memberMatched = (members, text) =>
    members.find(m => RegExp(m.keyWords.join('|')).test(text))

  //memberMatched(members, post.content) ||
  return (
    memberMatched(members, post.title) ||
    memberMatched(members, post.content) || {
      identity: 'other',
      name: '',
      generation: 0,
    }
  )
}

const getInitialPostIds = groupUrls => {
  let promises = groupUrls.map(async groupUrl => {
    let body = await fetch(groupUrl).then(res => res.text())
    let $ = cheerio.load(body, { decodeEntities: false })
    let initialPostId = $('div#blog > ul > li')
      .first()
      .find('a')
      .attr('href')
      .split('id')[1]
      .slice(1, -1)

    return initialPostId
  })

  return Promise.all(promises).then(values => values)
}

const getPostsInAGroup = async group => {
  let posts = []
  let postId = group.initialPostId

  while (postId) {
    body = await fetch(postUrl(postId)).then(res => res.text())
    let post = getPost(body)
    let writer = getWriter(members, post)
    posts.push({
      group: group.identity,
      writerIdentity: writer.identity,
      identity: postId,
      title: post.title,
      date: post.date,
      content: post.content,
    })
    postId = await getNextPostId(body, PostType.old)
  }

  return posts
}

const getPosts = groups => {
  let promises = groups.map(g => getPostsInAGroup(g))
  return Promise.all(promises).then(values =>
    values.reduce((acc, v) => [...acc, ...v], [])
  )
}

const createPosts = posts => {
  mongoose.connect(dbPath, { useNewUrlParser: true })
  let promises = posts.map(p => createPost(p))

  return Promise.all(promises).then(values => {
    mongoose.connection.close()
    return values
  })
}

const main = async () => {
  let groupUrls = groupArray.map(g => groupUrl(g))
  let initialPostIds = await getInitialPostIds(groupUrls)
  let groups = groupArray.map((g, idx) => ({
    identity: g,
    initialPostId: initialPostIds[idx],
  }))
  let posts = await getPosts(groups)
  posts = await createPosts(posts)

  console.log(posts.length)

  // const fs = require('fs')
  // let postJson = JSON.stringify(posts, null, 2)
  // fs.writeFileSync('temp.json', postJson)
}

main()

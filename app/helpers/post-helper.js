const fetch = require('node-fetch')
const cheerio = require('cheerio')

const PostType = {
  new: 'next',
  old: 'prev',
}

const getPostUrl = id => `http://www2.ske48.co.jp/blog/detail/id:${id}`
const getGroupUrl = group =>
  `http://www2.ske48.co.jp/blog/member/writer:${group}`

const getNextPostId = (body, type) => {
  let $ = cheerio.load(body, { decodeEntities: false })
  let href = $(`li.${type} > a`).attr('href')

  return href && href.split('id')[1].slice(1)
}

const getWriter = (members, post) => {
  const memberMatched = (members, text) =>
    members.find(m => RegExp(m.keywords.join('|')).test(text))

  return (
    memberMatched(members, post.title) ||
    memberMatched(members, post.content) || {
      identity: 'other',
      name: '',
      generation: 0,
    }
  )
}

const getPost = body => {
  let $ = cheerio.load(body, { decodeEntities: false })
  let title = $('div#blog_detail > h3').html()
  let date = $('div#blog_detail > time').html()
  let content = $('div#blog_detail').html()

  return { title, date, content }
}

const getPostsInOneGroup = async (group, type, members) => {
  let posts = []
  let postId = group.initialPostId

  while (postId) {
    let postUrl = getPostUrl(postId)
    body = await fetch(postUrl).then(res => res.text())
    let post = getPost(body)
    let writer = getWriter(members[group.identity], post)
    posts.push({
      group: group.identity,
      writer_identity: writer.identity,
      identity: postId,
      title: post.title,
      date: post.date,
      content: post.content,
    })
    postId = getNextPostId(body, type)
  }

  return posts
}

const getPostsInGroupsFromWeb = (groups, type, members) => {
  let promises = groups.map(g => getPostsInOneGroup(g, type, members))
  return Promise.all(promises).then(values =>
    values.reduce((acc, v) => [...acc, ...v], [])
  )
}

const getNextPostIdFromPostPage = async (postId, type) => {
  let postUrl = getPostUrl(postId)
  let body = await fetch(postUrl).then(res => res.text())
  return getNextPostId(body, type)
}

const getInitialPostIdsFromGroupPages = groups => {
  let groupUrls = groups.map(g => getGroupUrl(g))
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

module.exports = {
  PostType,
  getPostsInGroupsFromWeb,
  getNextPostIdFromPostPage,
  getInitialPostIdsFromGroupPages,
}

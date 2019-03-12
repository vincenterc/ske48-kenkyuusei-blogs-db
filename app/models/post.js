const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
  group: String,
  writer: String,
  identity: String,
  date: String,
  title: String,
  content: String,
})

module.exports = mongoose.model('Post', PostSchema)

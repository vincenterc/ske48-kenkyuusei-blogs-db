const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GroupEnum = ['ken91', 'ken92', 'ken93', 'ken94']

const PostSchema = new Schema({
  group: { type: String, enum: GroupEnum, require: true },
  member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  identity: String,
  date: String,
  title: String,
  content: String,
})

module.exports = mongoose.model('Post', PostSchema)

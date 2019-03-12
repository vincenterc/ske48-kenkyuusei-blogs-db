const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MemberSchema = new Schema({
  identity: String,
  name: String,
  generation: String,
})

module.exports = mongoose.model('Member', MemberSchema)

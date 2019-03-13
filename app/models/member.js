const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MemberSchema = new Schema(
  {
    identity: String,
    name: String,
    generation: String,
  },
  { id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

MemberSchema.virtual('name_eng').get(function() {
  let temp = this.identity.split('_')
  return `${temp[1]} ${temp[0]}`
})

MemberSchema.virtual('posts', {
  ref: 'Post',
  localField: 'identity',
  foreignField: 'writer_identity',
  justOne: false,
  options: { sort: { identity: -1 } },
})

module.exports = mongoose.model('Member', MemberSchema)

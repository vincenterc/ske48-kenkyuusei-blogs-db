const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MemberSchema = new Schema({
  identity: { type: String, required: true, max: 64 },
  name: { type: String, required: true, max: 64 },
  generation: {
    type: Schema.Types.ObjectId,
    ref: 'Generation',
    required: true,
  },
})

module.exports = mongoose.model('Member', MemberSchema)

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GenerationSchema = new Schema(
  {
    identity: String,
    title: String,
  },
  { id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

GenerationSchema.virtual('members', {
  ref: 'Member',
  localField: 'identity',
  foreignField: 'generation',
  justOne: false,
})

module.exports = mongoose.model('Generation', GenerationSchema)

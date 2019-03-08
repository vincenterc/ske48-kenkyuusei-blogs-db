const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GenerationSchema = new Schema({
  name: { type: String, required: true, max: 8 },
})

module.exports = mongoose.model('Generation', GenerationSchema)

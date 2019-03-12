const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GenerationSchema = new Schema({
  identity: String,
  title: String,
})

module.exports = mongoose.model('Generation', GenerationSchema)

const Generation = require('../models/generation')

const createGeneration = async generation => {
  let generationFound = await Generation.find({
    identity: generation.identity,
  }).exec()

  if (generationFound.length === 0) {
    return Generation.create({ ...generation }).catch(err => console.log(err))
  } else {
    console.log(`Generation, ${generation.identity}, is already created.`)
  }
}

module.exports = { createGeneration }

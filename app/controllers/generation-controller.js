const Generation = require('../models/generation')
const Member = require('../models/member')
const Post = require('../models/post')

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

const readGenerationDetailList = async () => {
  return await Generation.find({}, '-_id -__v').populate({
    path: 'members',
    select: '-_id -__v',
    populate: { path: 'posts', select: '-_id -__v -group' },
  })
}

module.exports = { createGeneration, readGenerationDetailList }

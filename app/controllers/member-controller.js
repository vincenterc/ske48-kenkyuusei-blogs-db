const Member = require('../models/member')

const createMember = async member => {
  let memberFound = await Member.find({ identity: member.identity }).exec()

  if (memberFound.length === 0) {
    return Member.create({ ...member }).catch(err => console.log(err))
  } else {
    console.log(`Member, ${member.identity}, is already created.`)
  }
}

module.exports = {
  createMember,
}

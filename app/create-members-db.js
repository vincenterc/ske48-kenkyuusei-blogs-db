const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const { createMember } = require('./controllers/member-controller')
const members = require('./data/members.json')

const main = async () => {
  mongoose.connect(dbPath, { useNewUrlParser: true })

  let memberList = [
    { identity: 'other', name: 'other', generation: '0' },
    ...members,
  ]

  let membersReturned = await memberList.reduce(
    async (ms, m) => [...(await ms), await createMember(m)],
    Promise.resolve([])
  )

  console.log(membersReturned)

  mongoose.connection.close()
}

main()

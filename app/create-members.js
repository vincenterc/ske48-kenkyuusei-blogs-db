const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const { createMember } = require('./controllers/member-controller')
const members = require('./data/members.json')

mongoose.connect(dbPath, { useNewUrlParser: true })

const main = async () => {
  let membersReturned = await members.reduce(
    async (acc, m) => [...(await acc), await createMember(m)],
    Promise.resolve([])
  )

  console.log(membersReturned)
  
  mongoose.connection.close()
}

main()

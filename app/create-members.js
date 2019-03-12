const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const { createMember } = require('./controllers/member-controller')
const members = require('./data/members.json')

mongoose.connect(dbPath, { useNewUrlParser: true })

const main = async () => {
  let promises = members.map(m => createMember(m))

  Promise.all(promises)
    .then(values => console.log(values))
    .then(() => mongoose.connection.close())
}

main()

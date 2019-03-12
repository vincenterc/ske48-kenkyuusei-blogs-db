const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const { createGeneration } = require('./controllers/generation-controller')

mongoose.connect(dbPath, { useNewUrlParser: true })

const generations = [
  { identity: '7', title: '7th' },
  { identity: '8', title: '8th' },
  { identity: 'd3', title: 'draft 3th' },
  { identity: '9', title: '9th' },
]

const main = async () => {
  let promises = generations.map(g => createGeneration(g))

  Promise.all(promises)
    .then(values => console.log(values))
    .then(() => mongoose.connection.close())
}

main()

const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const { createGeneration } = require('./controllers/generation-controller')

const generations = [
  { identity: '7', title: '7th' },
  { identity: '8', title: '8th' },
  { identity: 'd3', title: 'draft 3th' },
  { identity: '9', title: '9th' },
]

const main = async () => {
  mongoose.connect(dbPath, { useNewUrlParser: true })

  let generationsReturned = await generations.reduce(
    async (gs, g) => [...(await gs), await createGeneration(g)],
    Promise.resolve([])
  )

  console.log(generationsReturned)

  mongoose.connection.close()
}

main()

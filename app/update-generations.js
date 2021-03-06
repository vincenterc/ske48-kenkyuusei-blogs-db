const fs = require('fs')
const mongoose = require('mongoose')

const { dbPath } = require('./constants')
const {
  getGenerationDetailList,
} = require('./controllers/generation-controller')

const fileName = 'generations.json'

const main = async () => {
  mongoose.connect(dbPath, { useNewUrlParser: true })

  let generations = await getGenerationDetailList()
  // generations = generations.filter(g => g.identity !== '0')
  let generationsFiltered = generations.filter(g => g.members.length !== 0)

  fs.writeFileSync(fileName, JSON.stringify(generationsFiltered, null, 2))

  mongoose.connection.close()
}

main()

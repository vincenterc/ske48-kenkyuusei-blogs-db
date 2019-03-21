const fs = require('fs')

const membersWithKeywords = require('./data/members-with-keywords.json')

let members = Object.keys(membersWithKeywords).reduce(
  (acc, key) => [...acc, ...membersWithKeywords[key]],
  []
)

members = members
  .filter(
    (member, idx) =>
      members.findIndex(m => m.identity === member.identity) === idx
  )
  .map(m => {
    let tempMember = { ...m }
    delete tempMember.keywords
    return tempMember
  })

console.log(members.length)

fs.writeFileSync('./app/data/members.json', JSON.stringify(members, null, 2))

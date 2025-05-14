import fs from 'fs/promises'

console.log('reading persons')
const persons = await fs.readFile('./persons.txt', 'utf-8')
console.log(persons)

console.log('doing things')

console.log('reading logs')
const logs = await fs.readFile('./logs.txt', 'utf-8')
console.log(logs)

console.log('doing more things')

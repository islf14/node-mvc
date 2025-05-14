import fs from 'fs'

console.log('reading persons')
fs.readFile('./persons.txt', 'utf-8', (err, data) => {
  if (err) throw err
  console.log(data)
})

console.log('doing things')

console.log('reading logs')
fs.readFile('./logs.txt', 'utf-8', (err, data) => {
  if (err) throw err
  console.log(data)
})

console.log('doing more things =========/')

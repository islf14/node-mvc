import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

let allBooks = []

if (existsSync('books1.json')) {
  try {
    const data = await fs.readFile('books1.json', 'utf-8')
    allBooks = JSON.parse(data)
    console.log(allBooks)
  } catch (error) { console.log('file empty') }
}

const book =
{
  title: 'pedro 1',
  genre: 'Drama',
  type: 'boys',
  pages: 98
}

// const books = [
//   {
//     title: 'book one',
//     genre: 'drama',
//     type: 'People',
//     pages: 991
//   },
//   {
//     title: 'book two',
//     genre: 'terror',
//     type: 'children',
//     pages: 56
//   }
// ]
// console.log(books)
// const allBooks = {
//   ...books,
//   book
// }

allBooks.push(book)

console.log(allBooks)
// console.log(allBooks)

const jsonData = JSON.stringify(allBooks, null, 2)

try {
  await fs.writeFile('books1.json', jsonData, 'utf8')
} catch (error) {
  console.log(error)
}

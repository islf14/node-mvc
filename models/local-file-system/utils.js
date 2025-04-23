// import movies from './movies.json'

// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// import movies from './movies.json' with { type: "json" }

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
export const readJSON = (path) => require(path)

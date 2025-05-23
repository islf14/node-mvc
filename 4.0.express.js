const express = require('express')
const dataJson = require('./data.json')

const PORT = process.env.PORT ?? 3000
const app = express()
app.disable('x-powered-by')

// express json replaces all code below
app.use(express.json())

// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()
//   let body = ''
//   req.on('data', chunk => {
//     body += chunk.toString()
//   })
//   req.on('end', () => {
//     const data = JSON.parse(body)
//     data.timestamp = Date.now()
//     req.body = data
//     next()
//   })
// })

app.get('/all/data', (req, res) => {
  res.json(dataJson)
})

app.post('/all', (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log('Server listening on port http://localhost:3000')
})

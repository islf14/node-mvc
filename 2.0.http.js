const http = require('node:http')
const { findAvailablePort } = require('./free-port')

const server = http.createServer((req, res) => {
  console.log('request received')
  res.end('hi world')
})

findAvailablePort(4000).then(port => {
  server.listen(port, () => {
    console.log(`server is listening on port http://localhost:${port}`)
  })
})

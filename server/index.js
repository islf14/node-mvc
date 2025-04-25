import { createClient } from '@libsql/client'
import { configDotenv } from 'dotenv'
import express from 'express'
import logger from 'morgan'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

configDotenv()

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    // maxDisconnectionDuration:
  }
})

const db = createClient({
  url: 'libsql://movies-db-islf14.aws-us-east-1.turso.io',
  authToken: process.env.DB_TOKEN
})

try {
  const sql = 'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, username TEXT);'
  // const sql = 'DROP TABLE messages;'
  await db.execute(sql)
} catch (error) {
  console.log(error)
}

// receive a connection
io.on('connection', async (socket) => {
  console.log('------------ A user has logged in ------------')
  socket.on('disconnect', () => {
    console.log('A user has logged out')
  })

  // receive a message
  socket.on('chat message', async (msg) => {
    let result
    const username = socket.handshake.auth.username ?? 'anonymous'
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, username) VALUES (:msg, :username)',
        args: { msg, username }
      })
    } catch (error) {
      console.log(error)
      return
    }
    // send message to client
    console.log('message write ind db and send to client: ' + msg)
    io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
  })

  // send missing messages
  console.log(socket.handshake.auth.serverOffSet)
  if (!socket.recovered) {
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffSet ?? 0]
      })
      result.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id.toString(), row.username)
      })
    } catch (error) {
      console.log('----- Error reading missing messages -----')
      console.log(error)
    }
  }
})

app.use(logger('dev'))

app.use('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port} \n`)
})

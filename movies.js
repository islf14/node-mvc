import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { createMoviesRouter } from './routes/movies.js'
import 'dotenv/config'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.get('/', (req, res) => { res.json({ message: 'hi world' }) })
  app.use('/movies', createMoviesRouter({ movieModel }))

  const PORT = process.env.PORT ?? 3000
  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
  })
}

// import { MovieModel } from '../models/local-file-system/movie.js'
import { MovieModel } from '../models/mysql/movie.js'
import { validateMovie, validatePartialMovie } from './movies-validator.js'

export class MovieController {
  static async getAll (req, res) {
    // const origin = req.header('origin')
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //   res.header('Access-Control-Allow-Origin', origin)
    // }

    console.log('accepted: ' + req.header('origin'))

    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    // if (genre) {
    //   const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    //   return res.json(filteredMovies)
    // }
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    // const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await MovieModel.create({ input: result.data })
    // const newMovie = {
    //   id: randomUUID(),
    //   ...result.data
    // }
    // movies.push(newMovie)
    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updateMovie = await MovieModel.update({ id, input: result.data })
    // const movieIndex = movies.findIndex(movie => movie.id === id)
    // if (movieIndex === -1) {
    //   return res.status(404).json({ message: 'Movie not found' })
    // }

    // const updateMovie = {
    //   ...movies[movieIndex],
    //   ...result.data
    // }

    // movies[movieIndex] = updateMovie
    return res.json(updateMovie)
  }

  static async delete (req, res) {
    // const origin = req.header('origin')
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //   res.header('Access-Control-Allow-Origin', origin)
    // }

    const { id } = req.params
    const result = await MovieModel.delete({ id })
    // const movieIndex = movies.findIndex(movie => movie.id === id)

    if (result === false) {
      return res.status(400).json({ message: 'Movie not found' })
    }
    // movies.splice(movieIndex, 1)
    return res.json({ message: 'Movie deleted' })
  }
}

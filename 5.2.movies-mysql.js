import { createApp } from './movies.js'
import { MovieModel } from './models/mysql/movie.js'
createApp({ movieModel: MovieModel })

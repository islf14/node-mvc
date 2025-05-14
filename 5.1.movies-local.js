import { createApp } from './movies.js'
import { MovieModel } from './models/local-file-system/movie.js'
createApp({ movieModel: MovieModel })

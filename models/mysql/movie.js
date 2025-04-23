import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '123456',
  database: 'movies_db'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      let genres = null
      let sql = 'SELECT id, name FROM movies_db.genre WHERE lower(name) = ?;'
      let values = [lowerCaseGenre]
      try {
        const [rows] = await connection.execute(sql, values)
        if (rows.length === 0) return null
        else genres = rows
      } catch (err) {
        console.log(err)
      }
      const [{ id }] = genres
      sql = 'SELECT BIN_TO_UUID(movies_db.movie.id) id, title, year, director, duration, poster, movies_db.genre.name, rate FROM movies_db.movies_genres INNER JOIN movies_db.movie ON movies_db.movies_genres.movie_id = movies_db.movie.id INNER JOIN movies_db.genre ON movies_db.movies_genres.genre_id = movies_db.genre.id WHERE movies_db.movies_genres.genre_id = ?;'
      values = [id]
      try {
        const [data] = await connection.execute(sql, values)
        return data
      } catch (err) {
        console.log(err)
      }
    }
    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie;'
    )
    return movies
  }

  static async getById ({ id }) {
    const sql = 'SELECT BIN_TO_UUID(movie.id) id, title, year, director, duration, poster, rate FROM movie WHERE movie.id = UUID_TO_BIN(?);'
    const values = [id]
    try {
      const [movies] = await connection.execute(sql, values)
      if (movies.length === 0) return null
      return movies[0]
    } catch (err) {
      console.log(err)
    }
    return null
  }

  static async create ({ input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      genre,
      rate
    } = input
    let NewUuid = ''
    try {
      const [uuidResult] = await connection.query('SELECT uuid() uuid;')
      const [{ uuid }] = uuidResult
      NewUuid = uuid
    } catch (err) {
      console.log(err)
      return null
    }
    // register movie with generated UUID
    const sql = 'INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)'
    const values = [NewUuid, title, year, director, duration, poster, rate]
    try {
      await connection.execute(sql, values)
    } catch (err) {
      console.log(err)
    }
    // register in movies_genres the genres assigned to this movie
    const { status } = await this.createMovieGenres({ id: NewUuid, genre })
    if (status === 'ok') {
      const newMovie = await this.getById({ id: NewUuid })
      return [newMovie, genre]
    }
  }

  static async createMovieGenres ({ id, genre }) {
    genre.forEach(async element => {
      const sql = 'SELECT * FROM movies_db.genre where genre.name = ?;'
      const values = [element]
      let genreInDB = null
      try {
        const [rows] = await connection.execute(sql, values)
        const [{ id }] = rows
        genreInDB = id
      } catch (err) {
        console.log(err)
      }
      const sql2 = 'INSERT INTO movies_db.movies_genres (movies_genres.movie_id, movies_genres.genre_id) VALUES (UUID_TO_BIN(?), ?);'
      const values2 = [id, genreInDB]
      try {
        await connection.execute(sql2, values2)
      } catch (err) {
        console.log(err)
      }
    })
    return { status: 'ok' }
  }

  static async update ({ id, input }) {
    const movie = await this.getById({ id })
    if (!movie) return { message: 'Error, Movie not found' }

    const {
      title,
      year,
      director,
      duration,
      poster,
      genre,
      rate
    } = input

    // join all query and values
    let sqlSet = ''
    let sqlValues = []
    if (title) {
      sqlSet += ' movie.title = ?'
      sqlValues = [...sqlValues, title]
    }
    if (year) {
      if (sqlSet === '') sqlSet += ' movie.year = ?'
      else sqlSet += ', movie.year = ?'
      sqlValues = [...sqlValues, year]
    }
    if (director) {
      if (sqlSet === '') sqlSet += ' movie.director = ?'
      else sqlSet += ', movie.director = ?'
      sqlValues = [...sqlValues, director]
    }
    if (duration) {
      if (sqlSet === '') sqlSet += ' movie.duration = ?'
      else sqlSet += ', movie.duration = ?'
      sqlValues = [...sqlValues, duration]
    }
    if (poster) {
      if (sqlSet === '') sqlSet += ' movie.poster = ?'
      else sqlSet += ', movie.poster = ?'
      sqlValues = [...sqlValues, poster]
    }
    if (rate) {
      if (sqlSet === '') sqlSet += ' movie.rate = ?'
      else sqlSet += ', movie.rate = ?'
      sqlValues = [...sqlValues, rate]
    }

    // create query to update
    if (sqlSet !== '') {
      const sql = `UPDATE movies_db.movie SET ${sqlSet} WHERE movie.id = UUID_TO_BIN(?);`
      const values = [...sqlValues, id]
      try {
        await connection.execute(sql, values)
      } catch (err) {
        console.log(err)
      }
    }
    if (genre) {
      // remove all genres from this movie
      await this.deleteMovieGenres({ id })

      // register in movies_genres the genres assigned to this movie
      const { status } = await this.createMovieGenres({ id, genre })
      if (status === 'ok') {
        const newMovie = await this.getById({ id })
        return [newMovie, genre]
        // return ({ message: 'Error!, Movie not found' })
      }
      console.log(genre)
    }
  }

  // remove all genres from a movie
  static async deleteMovieGenres ({ id }) {
    const sql = 'DELETE FROM movies_db.movies_genres WHERE movies_genres.movie_id = UUID_TO_BIN(?);'
    const values = [id]
    try {
      await connection.execute(sql, values)
    } catch (err) {
      console.log(err)
    }
  }

  static async delete ({ id }) {
    await this.deleteMovieGenres({ id })
    const sql = 'DELETE FROM movies_db.movie WHERE movie.id = UUID_TO_BIN(?);'
    const values = [id]
    try {
      await connection.execute(sql, values)
    } catch (err) {
      console.log(err)
    }
    return true
  }
}

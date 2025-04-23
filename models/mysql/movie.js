import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '123456',
  database: 'movies_db'
}

const connection = await mysql.createConnection(config)

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
    let sql = 'INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)'
    let values = [NewUuid, title, year, director, duration, poster, rate]
    try {
      await connection.execute(sql, values)
    } catch (err) {
      console.log(err)
    }
    // register movies_genres with each type of genre
    genre.forEach(async element => {
      sql = 'SELECT * FROM movies_db.genre where genre.name = ?;'
      values = [element]
      let genreInDB = null
      try {
        const [rows] = await connection.execute(sql, values)
        const [{ id }] = rows
        genreInDB = id
      } catch (err) {
        console.log(err)
      }
      sql = 'INSERT INTO movies_db.movies_genres (movies_genres.movie_id, movies_genres.genre_id) VALUES (UUID_TO_BIN(?), ?);'
      values = [NewUuid, genreInDB]
      try {
        await connection.execute(sql, values)
      } catch (err) {
        console.log(err)
      }
    })

    const newMovie = await this.getById({ id: NewUuid })
    return [newMovie, genre]
  }

  static async update ({ id, input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      genre,
      rate
    } = input

    console.log(input)
    let sql = 'UPDATE'
    let sqlSet = 'SET'
    let values = []
    if (title) {
      sqlSet += ' movie.title = ?'
      values = [title]
    }
    if (year) {
      if (sqlSet === 'SET') sqlSet += ' movie.year = ?'
      else {
        sqlSet += ', movie.year = ?'
        values = [...values, year]
      }
    }
    if (director) {
      if (sqlSet === 'SET') sqlSet += ' movie.director = ?'
      else {
        sqlSet += ', movie.director = ?'
        values = [...values, director]
      }
    }
    if (duration) {
      if (sqlSet === 'SET') sqlSet += ' movie.duration = ?'
      else {
        sqlSet += ', movie.duration = ?'
        values = [...values, duration]
      }
    }
    if (poster) {
      if (sqlSet === 'SET') sqlSet += ' movie.poster = ?'
      else {
        sqlSet += ', movie.poster = ?'
        values = [...values, poster]
      }
    }
    if (genre) {
      // sqlSet += 'movie.genre = ? '
      console.log(genre)
    }
    if (rate) {
      if (sqlSet === 'SET') sqlSet += ' movie.rate = ?'
      else {
        sqlSet += ', movie.rate = ?'
        values = [...values, rate]
      }
    }
    sql = `UPDATE movies_db.movie ${sqlSet} WHERE movie.id = UUID_TO_BIN(?);`
    values = [...values, id]
    console.log(sql)
    console.log(values)
  }

  static async delete ({ id }) {

  }
}

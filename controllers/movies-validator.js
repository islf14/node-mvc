import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title must be required'
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5.5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      invalid_type_error: 'Movie genre must be  an array of enum Genre',
      required_error: 'Movie genre is required'
    }
  )
})

export function validateMovie (input) {
  return movieSchema.safeParse(input)
}
export function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}

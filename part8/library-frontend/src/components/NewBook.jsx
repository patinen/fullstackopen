import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../queries'

const NewBook = ({ updateCacheWith, setError, yearOptions }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const message = error.graphQLErrors.map(e => e.message).join('\n')
      setError(message)
    },
    update: (cache, response) => {
      updateCacheWith(cache, response.data.addBook)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      }
    })
    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    if (genre.trim() !== '') {
      setGenres(genres.concat(genre.trim()))
      setGenre('')
    }
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          Title: <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          Author: <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          Published:
          <select value={published} onChange={({ target }) => setPublished(target.value)}>
            <option value="" disabled>Select year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button type="button" onClick={addGenre}>add genre</button>
        </div>
        <div>Genres: {genres.join(', ')}</div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  )
}

export default NewBook
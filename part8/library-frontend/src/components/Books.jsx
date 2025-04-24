import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const { loading, data } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre }
  })

  if (loading) return <div>Loading books...</div>

  const genres = [...new Set(data.allBooks.flatMap(b => b.genres))]

  return (
    <div>
      <h2>Books</h2>

      {selectedGenre && <p>Showing books in genre: <strong>{selectedGenre}</strong></p>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setSelectedGenre(null)}>All genres</button>
        {genres.map(g => (
          <button key={g} onClick={() => setSelectedGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
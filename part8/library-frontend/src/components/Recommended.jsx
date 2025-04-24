import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = () => {
  const userResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS)

  if (userResult.loading || booksResult.loading) {
    return <div>Loading...</div>
  }

  const favoriteGenre = userResult.data.me.favoriteGenre
  const books = booksResult.data.allBooks.filter(b =>
    b.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>Recommended books</h2>
      <p>Books in your favorite genre: <strong>{favoriteGenre}</strong></p>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
import { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

import Notify from './components/Notify'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const updateCacheWith = (client, addedBook) => {
  const includedIn = (set, object) =>
    set.map(b => b.id).includes(object.id)

  const dataInStore = client.readQuery({ query: ALL_BOOKS, variables: { genre: null } })

  if (!includedIn(dataInStore.allBooks, addedBook)) {
    client.writeQuery({
      query: ALL_BOOKS,
      variables: { genre: null },
      data: {
        allBooks: [...dataInStore.allBooks, addedBook]
      }
    })
  }
}

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)
      updateCacheWith(client, addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const yearOptions = Array.from({ length: 2025 - 1500 }, (_, i) => 1500 + i).reverse()

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/">books</Link>{' '}
        {!token && <Link to="/login">login</Link>}
        {token && (
          <>
            <Link to="/add">add book</Link>{' '}
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/login" element={<LoginForm setToken={setToken} setError={notify} />} />
        <Route path="/add" element={token ? <NewBook setError={notify} yearOptions={yearOptions} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
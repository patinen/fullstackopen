import { useState } from 'react'
import { useCountry } from './hooks'
import Country from './components/Country'

const App = () => {
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const country = useCountry(query)

  const handleSubmit = (e) => {
    e.preventDefault()
    setQuery(name)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
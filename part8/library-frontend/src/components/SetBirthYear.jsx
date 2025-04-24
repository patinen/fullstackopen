import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import Select from 'react-select'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const SetBirthYear = () => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)

  const { data, loading } = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = (event) => {
    event.preventDefault()
    if (!selectedAuthor || !selectedYear) return

    editAuthor({
      variables: {
        name: selectedAuthor.value,
        setBornTo: Number(selectedYear.value),
      }
    })

    setSelectedAuthor(null)
    setSelectedYear(null)
  }

  if (loading) return <p>Loading authors...</p>

  const authorOptions = data.allAuthors.map((a) => ({
    value: a.name,
    label: a.name
  }))

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 1000 }, (_, i) => {
    const year = currentYear - i
    return { value: year, label: String(year) }
  })

  return (
    <div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          Author:
          <Select
            value={selectedAuthor}
            onChange={setSelectedAuthor}
            options={authorOptions}
            placeholder="Choose an author..."
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          Birth Year:
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            options={yearOptions}
            placeholder="Choose a year..."
          />
        </div>
        <button
          type="submit"
          disabled={!selectedAuthor || !selectedYear}
          style={{ marginTop: '10px' }}
        >
          Update
        </button>
      </form>
    </div>
  )
}

export default SetBirthYear
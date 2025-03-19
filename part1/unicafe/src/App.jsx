import React, { useState } from 'react'

  const Header = ({ head }) => <h1>{head}</h1>

  const Button = ({ onClick, name }) => {
    return (
      <button onClick={onClick}>{name}</button>
    )
  }

  const Stats = ({ text, value }) => {
      return (
         <table>
          <tbody>
            <tr>
              <td>{text}</td>
              <td>{value}</td>
            </tr>
          </tbody>
        </table>
        
      )
    }
 
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => { setGood(good + 1) }
  const neutralClick = () => { setNeutral(neutral + 1) }
  const badClick = () => { setBad(bad + 1) }

  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100 + ' %'

  return (
    <div>
      <Header head='give feedback' />

      <Button onClick={goodClick} name='good' /> 
      <Button onClick={neutralClick} name='neutral' />
      <Button onClick={badClick} name='bad' />

      <Header head='statistics' />

      {total === 0 ? (
        <p>No feedback given yet</p>
      ) : ( 
        <div>
          <Stats text='good' value={good} />
          <Stats text='neutral' value={neutral} />
          <Stats text='bad' value={bad} />
          <Stats text='total' value={total} />
          <Stats text='average' value={average} />
          <Stats text='positive' value={positive} />
          </div>
        )}
    </div> 

  )
}

export default App
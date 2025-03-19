import { useState } from 'react'

const Header = ({ head }) => <h1>{head}</h1>

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length)) 
  } 

  const voteAnecdote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const mostVotedIndex = votes.indexOf(Math.max(...votes))

  return (
    <div>
        <Header head='anecdote of the day' />
        <p>{anecdotes[selected]}</p>
        <p>has {votes[selected]} votes</p>
        <Button handleClick={voteAnecdote} text='vote' />
        <Button handleClick={nextAnecdote} text='next anecdote' />
        <Header head='most voted anecdote' />
        <p>{anecdotes[mostVotedIndex]}</p>
        <p>has {votes[mostVotedIndex]} votes</p>
    </div>
  )
}

export default App
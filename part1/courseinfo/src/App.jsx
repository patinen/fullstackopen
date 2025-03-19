import React from "react"

const Header = ({ course }) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      <Part1 name={parts[0].name} exercises={parts[0].exercises} />
      <Part2 name={parts[1].name} exercises={parts[1].exercises} />
      <Part3 name={parts[2].name} exercises={parts[2].exercises} />
    </div>
  )
}

const Part1 = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Part2 = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Part3 = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((acc, parts) => acc + parts.exercises, 0);
  return (
    <p>Number of exercises {totalExercises}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    { name: 'Fundamentals of React', exercises: 10 },
    { name: 'Using props to pass data', exercises: 7 },
    { name: 'State of a component', exercises: 14 },
  ]


return (
  <div>
    <Header course={course} />
    <Content parts={parts} />
    <Total parts={parts} />
  </div>
  )
}


export default App

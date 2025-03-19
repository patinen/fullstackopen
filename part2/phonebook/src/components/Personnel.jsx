const Personnel = ({ persons, handleDelete }) => (
  <div>
    {persons.length === 0 ? (
      <p>such empty here :/ add contacts to the list, please.</p> 
    ) : (
      persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))
    )}
  </div>
);
  
  export default Personnel;
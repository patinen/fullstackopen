import { useState, useEffect } from 'react';
import personService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Personnel from './components/Personnel';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
    const interval = setInterval(() => {
      personService.getAll().then(latestPersons => {
        setPersons(prevPersons => {
          const removedPersons = prevPersons.filter(p => !latestPersons.some(lp => lp.id === p.id));
          if (removedPersons.length > 0) {
            setNotification(`${removedPersons[0].name} was removed from the phonebook`);
            setNotificationType('error');
            setTimeout(() => setNotification(null), 5000);
          }
          return latestPersons;
        });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [])

  const showNotification = (message, type) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 5000);
  };

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook, replace the old number with a new one?`
      )
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService.update(existingPerson.id, updatedPerson).then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          showNotification(`${newName}s number was updated`, 'success');
        }).catch(error => {
          showNotification(`Information of ${newName} has already been removed from the server`, 'error');
          setPersons(persons.filter(person => person.id !== existingPerson.id));
        });
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`${newName} was added to the phonebook`, 'success');
      }).catch(error => {
        showNotification(`Failed to add ${newName}`, 'error');
      });
    }
    setNewName('')
    setNewNumber('')
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
        showNotification(`${personToDelete.name} was deleted`, 'success');
      }).catch(error => {
        showNotification(`Information of ${personToDelete.name} has already been removed from the server`, 'error');
        setPersons(persons.filter(person => person.id !== id));
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />
      <h3>Numbers</h3>
      <Personnel persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
import { useState, useEffect } from 'react';
import personServices from './services/persons';

const Title = ({ text }) => <h2>{text}</h2>;

const FilterInput = ({ text, value, handleChange }) => (
  <div>
    {text} <input value={value} onChange={handleChange} />
  </div>
);

const InputPart = ({ text, value, handleChange }) => (
  <div>
    {text} <input value={value} onChange={handleChange} />
  </div>
);

const ActionButton = ({ type, text, handleClick }) => (
  <button type={type} onClick={handleClick}>
    {text}
  </button>
);

const PersonForm = ({ onSubmit, newName, newNumber, handleNameChange, handleNumberChange }) => (
  <form onSubmit={onSubmit}>
    <InputPart text='name:' value={newName} handleChange={handleNameChange} />
    <InputPart text='number:' value={newNumber} handleChange={handleNumberChange} />
    <ActionButton text='add' type="submit" />
  </form>
);

const PersonList = ({ filteredPersons }) => (
  <div>
    {filteredPersons}
  </div>
);

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return (
    <div className='error'>
      {message}
    </div>
  );
};

const PhonebookApp = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [changeMessage, setChangeMessage] = useState('');

  useEffect(() => {
    personServices
      .getAll()
      .then(initialResult => {
        setPersons(initialResult);
      });
  }, []);
     
  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const checkName = persons.find(p => p.name.toLowerCase() === newPerson.name.toLowerCase());
    const changedPerson = { ...checkName, number: newNumber };

    if (checkName && checkName.number === newPerson.number) {
      window.alert(`${newName} is already added to phonebook`);
    } else if (checkName && checkName.number !== newPerson.number) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personServices
          .updatePerson(checkName.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== checkName.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');
            setTimeout(() => {
              setChangeMessage(`Number of ${newName} is changed`);
            }, 5000);
          })
          .catch(error => {
            setChangeMessage(`Information of ${newName} has already been removed from server`);
          });
      }
    } else {
      personServices
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setChangeMessage(`Successfully added ${newName}`);
          setTimeout(() => {
            setChangeMessage(null);
          }, 5000);
        }) 
        .catch(error => {
          setChangeMessage(`[Error] ${error.response.data.error}`);
        });
    }         
  };

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name} ?`)) {
      personServices
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  const handleNameChange = (event) => { setNewName(event.target.value); };
  const handleNumberChange = (event) => { setNewNumber(event.target.value); }; 
  const handleFilterChange = (event) => { setFilterName(event.target.value); }; 

  const filteredPersons = persons
    .filter(p => p.name.toLowerCase().includes(filterName.toLowerCase()))
    .map(({name,number,id}) => (
      <li key={id}>
        {name} {number } <ActionButton text='delete' handleClick={() =>  removePerson(id)} />
      </li>
    ));

  return (
    <div>
      <Title text='Phonebook' />
      <Notification message={changeMessage} />
      <FilterInput text='filter shown with' value={filterName} handleChange={handleFilterChange} />
      <Title text='add a new' />
      <PersonForm onSubmit={addNewPerson}
                  newName={newName} 
                  newNumber={newNumber} 
                  handleNameChange={handleNameChange} 
                  handleNumberChange={handleNumberChange}
      />
      <Title text='Numbers' />
      <PersonList filteredPersons={filteredPersons} />
    </div>
  );
};

export default PhonebookApp;

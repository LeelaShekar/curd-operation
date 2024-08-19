import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core'

const AppToaster = Toaster.create({
  position: 'top'
})

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWebsite, setNewWebsite] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((json) => setUsers(json))
  }, [])

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          name, email, website
        })
      })
        .then(response => response.json())
        .then(data => {
          setUsers([...users, data]);
          AppToaster.show({
            message: 'User added successfully',
            intent: 'success',
            timeout: 2000
          })
          setNewEmail('');
          setNewName('');
          setNewWebsite('');
        })

    }
  }

  function onChangeHandler(id, key, value) {
    setUsers((users) => {
      return users.map((user) => {
        return user.id === id ? { ...user, [key]: value } : user
      })
    })
  }

  function handleUpdateUser(id) {
    console.log(id)
    const user = users.find((user) => user.id === id);
    console.log(user)
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(data => {
        AppToaster.show({
          message: 'User updated successfully',
          intent: 'success',
          timeout: 2000
        })
      })
  }

  function handleDeleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(data => {
        setUsers((users) => {
          return users.filter((user) => user.id !== id)
        })
        AppToaster.show({
          message: 'User deleted successfully',
          intent: 'success',
          timeout: 2000
        })
      })
  }

  return (
    <div className="App">
      <h2>Crud Operations</h2>
      <table className='bp4-html-table modifier'>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>

        <tbody>
          {users.map((user) =>

            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email}></EditableText></td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website}></EditableText></td>
              <td>
                <Button intent='primary' onClick={() => handleUpdateUser(user.id)}>Update</Button>&nbsp;
                <Button intent='danger' onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Enter name...'></InputGroup>
            </td>
            <td>
              <InputGroup value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder='Enter email...'></InputGroup>
            </td>
            <td>
              <InputGroup value={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} placeholder='Enter webiste...'></InputGroup>
            </td>
            <td>
              <Button intent='success' onClick={addUser}>Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;

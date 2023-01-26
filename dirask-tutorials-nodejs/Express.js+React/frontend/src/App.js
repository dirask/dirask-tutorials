import { useEffect, useState } from 'react';

import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => setUsers(users))
            .catch(error => alert('`/api/users` data fetching error!\n Check if you use bakend server (URL: `http://localhost:8080`).'));
    }, []);
    return (
        <div className="App">
          <div>Data from backend:</div>
          {users.map((user, index) => {
              return (<div>{index + 1}. {user}</div>);  // do not forget to add key prop ...
          })}
        </div>
    );
}

export default App;

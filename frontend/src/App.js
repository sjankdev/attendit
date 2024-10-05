import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching data!', error);
      });
  }, []);

  return (
    <div>
      <h1>My App</h1>
      <p>{data}</p>
    </div>
  );
};

export default App;

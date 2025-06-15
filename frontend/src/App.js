import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Main from './pages/Main.jsx'
import axios from 'axios';
import './styles/App.css'


const App = () => {
  const [userName] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8002/products/');
        setData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <Header userName={userName} />
      <Main data={data} />
    </div>
  );
};

export default App;

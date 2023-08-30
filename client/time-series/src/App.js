import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data'); // Replace with your API endpoint
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Time Series Data</h1>
        <div className="data-container">
          {data.map((item, index) => (
            <div key={index} className="data-item">
              <strong>Name:</strong> {item.name}<br />
              <strong>Origin:</strong> {item.origin}<br />
              <strong>Destination:</strong> {item.destination}<br />
              <strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;

import './GestRisques.css';
import React, { useState, useEffect } from 'react';

const GestRisques = () => {
  const [risques, setRisque] = useState([]);
  const [filteredRisque, setFilteredRisque] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  const filterRisque = (risques, filterValue) => {
    if (!filterValue) return risques;

    return risques.filter(risque =>
      risque.processusname.toLowerCase().includes(filterValue.toLowerCase()) ||
      risque.type.toLowerCase().includes(filterValue.toLowerCase()) ||
      risque.libelle.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchRisques = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/risq/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setRisque(data.risq);
          setFilteredRisque(data.risq);
        } else {
          console.error("Failed to fetch risques:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRisques();
  }, []);

  const handleFilter = () => {
    const filteredData = filterRisque(risques, filterValue);
    setFilteredRisque(filteredData);
  };

  return (
    <div className="risques-list">
      <div>
        <a className="newRisque" href="/Nouvel_risque">nouvel risque</a>
      </div>
      <div className="filter">
        <input
          type="text"
          placeholder="Filter par Code, Type ou Processus"
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      {/* Table header row */}
      <div className="risque-header">
        <p>Processus</p>
        <p>Type</p>
        <p>Libelle</p>
        <p>Categorie</p>
        <p>Description</p>
        <p>Consequence</p>
        <p>Maitrise</p>
      </div>

      {/* Map through filtered risques and display information */}
      {filteredRisque.map(risque => (
        <div key={risque.id} className="risque">
          <p>{risque.processusname}</p>
          <p>{risque.type}</p>
          <p>{risque.libelle}</p>
          <p>{risque.categorie}</p>
          <p>{risque.description}</p>
          <p>{risque.consequence}</p>
          <p>
            <span className={`maitrise-indicator ${risque.maitrise}`}></span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default GestRisques;

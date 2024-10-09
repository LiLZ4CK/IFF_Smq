import './IndicateurList.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';

const IndicateurList = () => {
  const [Indicateurs, setIndicateur] = useState([]);
  const [filteredIndicateur, setFilteredIndicateur] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  const filterIndicateur = (Indicateur, filterValue) => {
    if (!filterValue) return Indicateur; // No filter, return all Actions

    return Indicateur.filter(indicateur =>
        indicateur.type.toLowerCase().includes(filterValue.toLowerCase()) ||
        indicateur.processus.toLowerCase().includes(filterValue.toLowerCase()) ||
        indicateur.code.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchIndicateur = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/Actions/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setIndicateur(data.actions);
          setFilteredActions(data.actions); // Set initial filtered data to all Actions
        } else {
          console.error("Failed to fetch Actions:", response.statusText);
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchActions();
  }, []);

  const handleFilter = () => {
    const filteredData = filterActions(Actions, filterValue);
    setFilteredActions(filteredData);
  };

  return (
    <div className="Actions-list">
     <div className="filter">
  <input
    type="text"
    placeholder="Filter par Code, Type ou Processus"
    value={filterValue}
    onChange={e => setFilterValue(e.target.value)}
  />
  <button onClick={handleFilter}>Filter</button>
      </div>
      <div>
        <a  className="newAction" href="/newAction" > Ajouter</a>
      </div>

      {/* Table header row */}
      <div className="Actions-header">
        <p>Action</p>
        <p>Status</p>
        <p>Libelle</p>
        <p>Type</p>
        <p>Priorite</p>
        <p>Echeance</p>
        <p>Couts</p>
      </div>

      {/* Map through filtered Actions and display information */}
      {filteredActions.map(action => (
        <div key={action.id} className="Actions">
          <p>{action.code}</p>
          <p>{action.status}</p>
          <p>{action.libelle}</p>
          <p>{action.type}</p>
          <p>{action.priorite}</p>
          <p>{action.echeance}</p>
          <p>{action.cout}</p>
        </div>
      ))}
    </div>
  );
};

export default ListDaction;
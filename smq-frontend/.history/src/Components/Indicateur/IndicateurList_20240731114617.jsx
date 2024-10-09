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
        const response = await fetch('http://localhost:3000/indic/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setIndicateur(data.indcs);
          setFilteredIndicateur(data.indcs); // Set initial filtered data to all Actions
        } else {
          console.error("Failed to fetch indicateur:", response.statusText);
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchIndicateur();
  }, []);

  const handleFilter = () => {
    const filteredData = filterIndicateur(Indicateurs, filterValue);
    setFilteredIndicateur(filteredData);
  };

  return (
    <div className="Indicateurs-list">
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
        <a  className="newIndicateurs" href="/Nouvel_indicateur" > Ajouter</a>
      </div>

      {/* Table header row */}
      <div className="Indicateurs-header">
        <p>Processus</p>
        <p>Indicateurs de performance</p>
        <p>Fréquence</p>
        <p>Axe Politique</p>
        <p>Formule de calcul</p>
        <p>Objectifs à atteindre</p>
        <p>Seuil de criticité</p>
        <p>Couts</p>
      </div>

      {/* Map through filtered Actions and display information */}
      {filteredActions.map(indicateur => (
        <div key={indicateur.id} className="Indicateurs">
          <p>{indicateur.processus}</p>
          <p>{indicateur.name}</p>
          <p>{indicateur.frequence}</p>
          <p>{indicateur.axePoli}</p>
          <p>{indicateur.formul}</p>
          <p>{indicateur.objectif}</p>
          <p>{indicateur.seuil}</p>
          <p>{indicateur.result}</p>
          <p>{indicateur.object}</p>
        </div>
      ))}
    </div>
  );
};

export default IndicateurList;
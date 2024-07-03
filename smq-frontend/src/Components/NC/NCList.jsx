import './NCList.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';

const ListNoconf = () => {
  const [Noconf, setNoconf] = useState([]);
  const [filteredNoconf, setFilteredNoconf] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  const filterNoconf = (Noconf, filterValue) => {
    if (!filterValue) return Noconf; // No filter, return all Noconf

    return Noconf.filter(noconf =>
        noconf.type.toLowerCase().includes(filterValue.toLowerCase()) ||
        noconf.processus.toLowerCase().includes(filterValue.toLowerCase()) ||
        noconf.code.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchNoconf = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/nconf/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setNoconf(data.nconf);
          setFilteredNoconf(data.nconf); // Set initial filtered data to all Noconf
        } else {
          console.error("Failed to fetch Noconf:", response.statusText);
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchNoconf();
  }, []);

  const handleFilter = () => {
    const filteredData = filterNoconf(Noconf, filterValue);
    setFilteredNoconf(filteredData);
  };

  return (
    <div className="Noconf-list">
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
        <a  className="newNoconf" href="/Nouvelle_NC" > Ajouter</a>
      </div>

      {/* Table header row */}
      <div className="Noconf-header">
        <p>processus</p>
        <p>Type de constat</p>
        <p>Description du constat</p>
        <p>Exigence</p>
      </div>

      {/* Map through filtered Actions and display information */}
      {filteredNoconf.map(noconf => (
        <div key={noconf.id} className="Noconfs">
          <p>{noconf.processus}</p>
          <p>{noconf.type}</p>
          <p>{noconf.constats}</p>
          <p>{noconf.refqualite}</p>
        </div>
      ))}
    </div>
  );
};

export default ListNoconf;
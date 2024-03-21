import './ListDaudit.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaFile } from 'react-icons/fa';

const AuditsList = () => {
  const [audits, setAudits] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  // Define filterAudits function outside useEffect
  const filterAudits = (audits, filterValue) => {
    if (!filterValue) return audits; // No filter, return all audits

    return audits.filter(audit =>
      audit.responsableId.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
      audit.processus.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/audits/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setAudits(data.audits);
        } else {
          console.error("Failed to fetch audits:", response.statusText);
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAudits();
  }, []);

  return (
    <div className="audits-list">
      <input
        type="text"
        placeholder="Filter by Name or Processus"
        value={filterValue}
        onChange={e => setFilterValue(e.target.value)}
      />

      {/* Table header row */}
      <div className="audit-header">
        <p>Audit ID</p>
        <p>Responsable</p>
        <p>Processus</p>
        <p>Description</p>
        <p>Voir</p>
        <p>Rapport</p>
      </div>

      {/* Map through filtered audits and display information */}
      {filterAudits(audits, filterValue).map(audit => (
        <div key={audit.id} className="audit">
          <p>{audit.id}</p>
          {/* Replace with 'audit.responsablename' if your data provides it */}
          <p>{audit.responsablename}</p>
          <p>{audit.processus}</p>
          <p>{audit.description}</p>
          <p>
            <button>
              <FaEye />
            </button>
          </p>
          <p>
            <button>
              <FaFile />
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default AuditsList;
import React, { useState, useEffect } from 'react';
import './NewIndicateur.css';

const NewIndicateur = () => {
  const [processes, setProcesses] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [selectedPross, setSelectedPross] = useState('');
  const [selectedRespo, setSelectedRespo] = useState('');
  const [name, setName] = useState('');
  const [frequence, setFrequence] = useState('');
  const [axe , setAxe ] = useState('');
  const [formule  , setFormule  ] = useState('');
  const [objectifs , setObjectifs ] = useState('');
  const [indicateurs  , setIndicateurs  ] = useState('');
  const [seuil   , setSeuil  ] = useState('');

  const frequencies = {
    mensuelle: 12,
    bimensuelle: 6,
    trimestrielle: 4,
    semestrielle: 2,
    annuelle: 1
  };

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/proc/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProcesses(data.procs);
        }
      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };

    const fetchResponsables = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/nconf/resp', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setResponsables(data.resp);
        }
      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };

    fetchProcesses();
    fetchResponsables();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    //send to backend
      alert('Form submitted!');
      setSelectedPross('');
      setSelectedRespo('');
  }

  const handleAnnuler = () =>{
    setSelectedPross('');
    setSelectedRespo('');
    setFrequence('');
    setAxe('');
    setName('');
    setFormule('');
    setObjectifs('');
    setIndicateurs('');
    setSeuil('');
  }

  const renderTFields = () => {
    const numFields = frequencies[frequence];
    const fields = [];

    for (let i = 1; i <= numFields; i++) {
      fields.push(
        <div key={`T${i}`} className="form-group">
          <label>T{i}</label>
          <input type="text" className="form-control" />
        </div>
      );
    }

    return fields;
  };

  return (
    <div className="Indicateur-container">
      <h2>Nouvel Indicateur</h2>
    <form>
      <div className="form-row">
      <div className="form-group left">
          <label>Indicateurs de performance</label>
          <textarea className="form-control" rows="3" 
            value={name}
            onChange={(e) => setName(e.target.value)}></textarea>
        </div>
        <div className="form-group left">
          <label htmlFor="proc">Processes*</label>
          <select
                  name="select"
                  id="select"
                  value={selectedPross}
                  onChange={(e) => setSelectedPross(e.target.value)}
                  required
                >
                  <option value="" disabled selected={selectedPross === ''}>
                    Nom de Processes
                  </option>
                  {processes.map((pros, index) => (
                    <option key={index} value={pros.name}>
                      {pros.name}
                    </option>
                  ))}
          </select>
        </div>
        <div className="form-group right">
         

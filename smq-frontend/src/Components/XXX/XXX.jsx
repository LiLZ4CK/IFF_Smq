import './XXX.css';
import React, { useState, useEffect } from 'react';

const fieldMappings = {
  "Moyens pour surveiller et ameliorer": "msurvielle",
  "Moyens Humains": "mhumains",
  "Donnees d'entree": "dentree",
  "Activiter du processus": "aprocessus",
  "Donnees de sortie": "dsortie",
  "Responsable": "responsable",
  "Indicateurs et Objectifs": "iobjectifs",
  "Doc. associes": "dassocies"
};

const XXX = () => {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [description, setDescription] = useState(null);
  const [newItem, setNewItem] = useState({});

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

    fetchProcesses();
  }, []);

  const handleSelectChange = async (e) => {
    const selectedId = e.target.value;
    const process = processes.find((proc) => proc.name === selectedId);
    setSelectedProcess(process);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/proc/descri', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ descri: process.id })
      });
      if (response.ok) {
        const data = await response.json();
        setDescription(data.desc);
        setNewItem(Object.keys(data.desc).reduce((acc, key) => {
          if (!['id', 'processusId'].includes(key)) acc[key] = '';
          return acc;
        }, {}));
      }
    } catch (error) {
      console.error('Error fetching process description:', error);
    }
  };

  const handleAddItem = (field) => {
    if (newItem[field].trim() === '') return;
    setDescription(prevState => ({
      ...prevState,
      [field]: [...prevState[field], newItem[field]]
    }));
    setNewItem(prevState => ({
      ...prevState,
      [field]: ''
    }));
  };

  const handleRemoveItem = (field, index) => {
    setDescription(prevState => ({
      ...prevState,
      [field]: prevState[field].filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field, value) => {
    setNewItem(prevState => ({
      ...prevState,
      [field]: value
    }));
  };
console.log(selectedProcess)
  return (
    <div>
      <div className='Pilot'>
        <div className='backP' />
        <div className='title'>
          <h2>Pilotage du processus</h2>
        </div>
        <div className='procelect'>
          <label htmlFor='process'>Select a process</label>
          <select name='process' id='process' onChange={handleSelectChange}>
            <option value=''>--Select a process--</option>
            {processes.map((pros, index) => (
              <option key={index} value={pros.name}>
                {pros.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {description && (
        <div className='process-details'>
          {Object.keys(fieldMappings).map((displayName, index) => {
            const field = fieldMappings[displayName];
            return (
              <div key={index} className={field}>
                <h3>{displayName}</h3>
                {description[field].map((item, itemIndex) => (
                  <div key={itemIndex} className='process-item'>
                    <span>{item}</span>
                    <button onClick={() => handleRemoveItem(field, itemIndex)}>X</button>
                  </div>
                ))}
                <div className='process-add-item'>
                  <input
                    type='text'
                    value={newItem[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                  <button onClick={() => handleAddItem(field)}>Add</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default XXX;

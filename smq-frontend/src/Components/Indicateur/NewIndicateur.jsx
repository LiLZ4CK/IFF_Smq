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
          <label htmlFor="respo">Resposable*</label>
          <select
                  name="select"
                  id="select"
                  value={selectedRespo}
                  onChange={(e) => setSelectedRespo(e.target.value)}
                  required
                >
                  <option value="" disabled selected={selectedRespo === ''}>
                    Nom de Resposable
                  </option>
                  {responsables.map((pros, index) => (
                    <option key={index} value={pros.name}>
                      {pros.name}
                    </option>
                  ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group left">
          <label>Fréquence</label>
          <select className="form-control" value={frequence} onChange={(e) => setFrequence(e.target.value)}>
            <option value="mensuelle">Mensuelle</option>
            <option value="bimensuelle">Bimensuelle</option>
            <option value="trimestrielle">Trimestrielle</option>
            <option value="semestrielle">Semestrielle</option>
            <option value="annuelle">Annuelle</option>
          </select>
        </div>
        <div className="form-group right">
          <label>Formule de calcul</label>
          <textarea className="form-control" rows="3" 
            value={formule}
            onChange={(e) => setFormule(e.target.value)}></textarea>
        </div>
        <div className="form-group right">
          <label>Axe Politique</label>
          <input type="text" className="form-control"  
            value={axe}
            onChange={(e) => setAxe(e.target.value)}/>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group left">
          <label>Objectifs à atteindre</label>
          <input type="text" className="form-control"  
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}/>
        </div>
        <div className="form-group left">
          <label>Indicateurs de performance</label>
          <input type="text" className="form-control"  
            value={indicateurs}
            onChange={(e) => setIndicateurs(e.target.value)}/>
        </div>
        <div className="form-group right">
          <label>Seuil de criticité</label>
          <input type="text" className="form-control" 
            value={seuil}
            onChange={(e) => setSeuil(e.target.value)} />
        </div>
      </div>
      <div className="form-buttons">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Sauvegarder
        </button>
        <button type="reset" className="btn btn-secondary" onClick={handleAnnuler}>
          Annuler
        </button>
      </div>
    </form>
    </div>
  );
};

export default NewIndicateur;

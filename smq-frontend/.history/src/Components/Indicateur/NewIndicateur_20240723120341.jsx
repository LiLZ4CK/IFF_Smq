import React, { useState, useEffect } from 'react';
import './NewIndicateur.css';

const NewIndicateur = () => {
  const [processes, setProcesses] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [selectedPross, setSelectedPross] = useState('');
  const [selectedRespo, setSelectedRespo] = useState('');
  const [frequence, setFrequence] = useState('');
  const [axe , setAxe ] = useState('');
  const [formule  , setFormule  ] = useState('');
  const [objectifs , setObjectifs ] = useState('');
  const [indicateurs  , setIndicateurs  ] = useState('');
  const [seuil   , setSeuil  ] = useState('');
  const [comments   , setComments  ] = useState('');
  const [phase, setPhase] = useState(1);

  const ProgressBar = ({ currentPhase }) => {
    const phases = ["Creation", "Suivi", "Realisation"];
  
    return (
      <div className="progress-bar">
        {phases.map((phase, index) => (
          <React.Fragment key={phase}>
            <div className={`circle ${currentPhase === index + 1 ? 'active' : currentPhase > index + 1 ? 'completed' : ''}`}>
              {phase}
            </div>
            {index < phases.length - 1 && <div className="line">.............</div>}
          </React.Fragment>
        ))}
      </div>
    );
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
    if (phase < 3) {
      setPhase(phase + 1);
    } else {
      // Handle final submission or resetting the form
      alert('Form submitted!');
      setPhase(1);
      setSelectedPross('');
      setSelectedRespo('');
    }
  };

  const renderForm = () => {
    switch (phase) {
      case 1:
        return (
          <form>
            <div className="form-row">
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
                    <option key={index} value={pros.id}>
                      {pros.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group left">
                <label>Fréquence</label>
                <textarea className="form-control" rows="3" 
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}></textarea>
              </div>
              <div className="form-group left">
                <label>Axe Politique</label>
                <input type="text" className="form-control"  
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}/>
              </div>
              <div className="form-group right">
                <label>Formule de calcul</label>
                <textarea className="form-control" rows="3" 
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}></textarea>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group left">
                <label>Objectifs à atteindre</label>
                <input type="text" className="form-control"  
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}/>
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
                Suivant
              </button>
              <button type="reset" className="btn btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        );
      case 2:
        return (
          <form>
            <div className="form-group">
              <label>Upload PDF</label>
              <input type="file" className="form-control" accept="application/pdf" />
            </div>
            <div className="form-buttons">
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Suivant
              </button>
              <button type="reset" className="btn btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        );
      case 3:
        return (
          <form>
            <div className="form-group">
              <label>Comments</label>
              <textarea className="form-control" rows="3" 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}></textarea>
            </div>
            <div className="form-buttons">
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Sauvegarder
              </button>
              <button type="reset" className="btn btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <h2>Nouvelle Indicateur</h2>
      <ProgressBar currentPhase={phase} />
      {renderForm()}
    </div>
  );
};

export default NewIndicateur;

import React, { useState, useEffect } from 'react';
import "./NewIndicateur.css";


const NewIndicateur = () => {
  const [processes, setProcesses] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [selectedPross, setSelectedPross] = useState("");
  const [selectedRespo, setSelectedRespo] = useState("");

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
  setPhase(phase + 1);
};

const renderForm = (phase) => {
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
            <option value="" disabled selected={selectedPross === ""}>
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
            <option value="" disabled selected={selectedRespo === ""}>
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
          <textarea className="form-control" rows="3"></textarea>
        </div>
        <div className="form-group left">
          <label>Axe Politique</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group right">
          <label>Formule de calcul</label>
          <textarea className="form-control" rows="3"></textarea>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group left">
          <label>Objectifs à atteindre</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group right">
          <label>Seuil de criticité</label>
          <input type="text" className="form-control" />
        </div>
      </div>

      <div className="form-buttons">
        <button type="button" className="btn btn-primary" onClick={handleSave}>Sauvegarder</button>
        <button type="reset" className="btn btn-secondary">Annuler</button>
      </div>
    </form>
  );
};

return (
  <div className="form-container">
    <h2>Nouvelle Indicateur - Phase {phase}</h2>
    {renderForm(phase)}
  </div>
);
};

export default MultiPhaseForm;
export default NewIndicateur;
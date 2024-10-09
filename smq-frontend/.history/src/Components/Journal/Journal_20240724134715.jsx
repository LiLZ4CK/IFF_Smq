import React, { useState, useEffect } from 'react';
import './Journal.css';

const Journal = () => {
    const [processes, setProcesses] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [selectedPross, setSelectedPross] = useState('');
    const [selectedRespo, setSelectedRespo] = useState('');
    const [typeConstat, setTypeConstat] = useState('');
    const [origine , setOrigine ] = useState('');
    const [date   , setDate ] = useState('');
    const [constat , setConstat ] = useState('');
    const [analyse  , setAnalyse  ] = useState('');
    const [typeAction   , setTypeAction  ] = useState('');
    const [action   , setAction  ] = useState('');
    const [delaiTrait   , setDelaiTrait  ] = useState('');
    const [suivi   , setSuivi  ] = useState('');
    const [actionEfficace   , setActionEfficace  ] = useState('');
    const [criteresDeval   , setCriteresDeval  ] = useState('');
    const [dateEvaluation   , setDateEvaluation  ] = useState('');
    const [observation   , setObservation  ] = useState('');
    const [phase   , setPhase  ] = useState(1);
    
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
  
    const clean = () => {
      setSelectedPross('');
      setSelectedRespo('');
      setTypeConstat('');
      setOrigine('');
      setDate('');
      setConstat('');
      setAnalyse('');
      setTypeAction('');
      setAction('');
      setAction('');
      setDelaiTrait('');
      setDelaiTrait('');
      setSuivi('');
      setActionEfficace('');
      setCriteresDeval('');
      setDateEvaluation('');
      setObservation('');
      setPhase(1);
    }

    const handleSave = (e) => {
      e.preventDefault();
      if (phase < 3) {
        setPhase(phase + 1);
      } else {
        // Handle final submission or resetting the form
        alert('Form submitted!');
        clean();
      }
    };
    const handleAnnuler = () =>{
      clean();
    }
  
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
                  <label>Type constat</label>
                  <input className="form-control" rows="3" 
                    value={typeConstat}
                    onChange={(e) => setTypeConstat(e.target.value)}></input>
                </div>
                <div className="form-group left">
                  <label>Origine</label>
                  <input type="text" className="form-control"  
                    value={origine}
                    onChange={(e) => setOrigine(e.target.value)}/>
                </div>
                <div className="form-group right">
                  <label>Date</label>
                  <input className="form-control" rows="3" type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group left">
                  <label>Constat</label>
                  <textarea type="text" className="form-control"  
                    value={constat}
                    onChange={(e) => setConstat(e.target.value)}/>
                </div>
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Suivant
                </button>
                <button type="reset" className="btn btn-secondary" onClick={handleAnnuler}>
                  Annuler
                </button>
              </div>
            </form>
          );
        case 2:
          return (
            <form>                
              <div className="form-row">
                <div className="form-group left">
                  <label>Analyse des causes</label>
                  <textarea className="form-control" rows="3" 
                    value={analyse}
                    onChange={(e) => setAnalyse(e.target.value)}></textarea>
                </div>
                <div className="form-group left">
                  <label>Type d'action</label>
                  <input type="text" className="form-control"  
                    value={typeAction}
                    onChange={(e) => setTypeAction(e.target.value)}/>
                </div>
                <div className="form-group right">
                  <label>Actions</label>
                  <textarea className="form-control" rows="3" 
                    value={action}
                    onChange={(e) => setAction(e.target.value)}></textarea>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group left">
                  <label>Délai de Traitement </label>
                  <input className="form-control" type="date"  
                    value={delaiTrait}
                    onChange={(e) => setDelaiTrait(e.target.value)}/>
                </div>
                <div className="form-group left">
                  <label>Suivi de réalisation </label>
                  <input type="text" className="form-control"  
                    value={suivi}
                    onChange={(e) => setSuivi(e.target.value)}/>
                </div>
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Suivant
                </button>
                <button type="reset" className="btn btn-secondary" onClick={handleAnnuler}>
                  Annuler
                </button>
              </div>
            </form>
          );
        case 3:
          return (
            <form>                
              <div className="form-row">
                <div className="form-group left">
                  <label>Action efficace</label>
                  <input className="form-control" rows="3" 
                    value={actionEfficace}
                    onChange={(e) => setActionEfficace(e.target.value)}></input>
                </div>
                <div className="Journal-group left">
                  <label>Critères d'évaluation</label>
                  <input type="text" className="Journal-control"  
                    value={criteresDeval}
                    onChange={(e) => setCriteresDeval(e.target.value)}/>
                </div>
                <div className="Journal-group right">
                  <label>Date d'évaluation</label>
                  <input className="Journal-control" rows="3" type="date"
                    value={dateEvaluation}
                    onChange={(e) => setDateEvaluation(e.target.value)}></input>
                </div>
              </div>
              <div className="Journal-row">
                <div className="Journal-group left">
                  <label>Observations</label>
                  <textarea className="Journal-control"   
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}/>
                </div>
              </div>
              <div className="Journal-buttons">
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Suivant
                </button>
                <button type="reset" className="btn btn-secondary" onClick={handleAnnuler}>
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
      <div className="Journal-container">
        <h2>Nouvelle Constat</h2>
        <ProgressBar currentPhase={phase} />
        {renderForm()}
      </div>
    );
  };
export default Journal; 
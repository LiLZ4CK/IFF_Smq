import './PilotageProc.css';
import React, { useState, useEffect } from 'react';

const PilotageProc = () => {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState();
  const [isSet, setIsSet] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [element, setElement] = useState("");
  const [pilot, setPilot] = useState("");
  const [finalite, setFinalite] = useState("");
  const [indic, setIndic] = useState("");

  useEffect(() => {
    const fetchProcess = async () => {
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
        console.log('error: ', error);
      }
    };
    fetchProcess();
  }, []);

  const handleSelectChange = (e) => {
    console.log('im here')
    const selectedId = e.target.value;
    const process = processes.find((proc) => proc.name === selectedId);
    setSelectedProcess(process);
    setIsSet(true)
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
  }

  return (
    <div>
      <div className='Pilot'>
        <div className='backP'/>
        <div className='title'>
          <h2>Pilotage du processus</h2>
        </div>
        <div className='procelect'>
        <label htmlFor='process'>Select a process </label>
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
      {isSet && (
        <div className='process-details'>
          <form onSubmit={handleSubmit}>
              <div className='boxP'>
                <input
                    type='text'
                    placeholder={selectedProcess.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                <input
                    type='text'
                    placeholder={selectedProcess.type}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                <input
                    type='text'
                    placeholder={selectedProcess.element}
                    value={element}
                    onChange={(e) => setElement(e.target.value)}
                  />
                <input
                    type='text'
                    placeholder={selectedProcess.pilot}
                    value={pilot}
                    onChange={(e) => setPilot(e.target.value)}
                  />
                <input
                    type='text'
                    placeholder={selectedProcess.finalite}
                    value={finalite}
                    onChange={(e) => setFinalite(e.target.value)}
                  />
                <input
                    type='text'
                    placeholder={selectedProcess.indic}
                    value={indic}
                    onChange={(e) => setIndic(e.target.value)}
                  />
              </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PilotageProc;
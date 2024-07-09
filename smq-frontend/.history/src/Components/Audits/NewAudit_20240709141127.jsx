import React, { useState, useEffect } from 'react';
import './NewAudit.css';

const NewAudit = () => {
    const [responsables, setResponsables] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [selectedPross, setSelectedPross] = useState("");
    const [selectedRespo, setSelectedRespo] = useState("");
    const [type, setType] = useState("");
    const [planificationDate, setPlanificationdate] = useState("");
    const [realisationDate, setRealisationdate] = useState("");
    const [lieu, setLieu] = useState("");
    
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

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const audit ={
            respo: selectedRespo,
            pross: selectedPross,
        }
        try{
            console.log('lets create!')
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/Actions/newActions',{
                method: 'POST',
                headers:  { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ })
            })
            if (response.ok){
                window.location.href = 'http://localhost:8000/Liste_des_Actions';
            }
        }
        catch(error){
            console.log('err == '+error)
        }
    };

    const handleReset = () => {
        setSelectedPross("");
        setSelectedRespo("");
        setType("");
        setPlanificationdate("");
        setRealisationdate("");
        setLieu("");
    };

    return (
        <div className="Auditform">
            <div className='auditbackk'></div>
            <h1> Nouvelle Audit</h1>
            <fieldset>
                <form action="#" method="get" onSubmit={(e) => handleSubmit(e)}>
                    <label for="respo">Resposable*</label>
                    <select
                        name="select"
                        id="select"
                        value={selectedRespo}
                        onChange={(e) => setSelectedRespo(e.target.value)}
                        required
                    >
                        <option value="" disabled selected={selectedPross === ""}>
                            Nom de Resposable
                        </option>
                        {responsables.map((pros, index) => (
                            <option key={index} value={pros.id}>
                                {pros.name}
                            </option>
                        ))}
                    </select>
                    <label for="proc">Processes*</label>
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
                    <label for="type">Enter Type* </label>
                    <select 
                        name="type"
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select Type</option>
                        <option value="audit interne">Audit Interne</option>
                        <option value="audit externe">Audit Externe</option>
                    </select>
                    
                    <label for="planification">Date de Planification*</label>
                    <input
                        type="datetime-local"
                        name="Echeance"
                        id="Echeance"
                        onChange={(e) =>
                            setPlanificationdate(e.target.value)
                        }
                        required
                    />
                    <label for="réalisation">Date de Réalisation*</label>
                    <input
                        type="datetime-local"
                        name="Echeance"
                        id="Echeance"
                        onChange={(e) =>
                            setRealisationdate(e.target.value)
                        }
                        required
                    />
                    <label for="Echeance">Lieu*</label>
                    <input
                        type="text"
                        name="Echeance"
                        id="Echeance"
                        onChange={(e) =>
                            setLieu(e.target.value)
                        }
                        required
                    />
                   
                    <button
                        type="reset"
                        value="reset"
                        onClick={() => handleReset()}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        value="Submit"
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        Submit
                    </button>
                </form>
            </fieldset>
        </div>
    );
}

export default NewAudit;
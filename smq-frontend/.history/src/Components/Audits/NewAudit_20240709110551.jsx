import React, { useState, useEffect } from 'react';
import './NewAudit.css';

const NewAudit = () => {
    const [responsables, setResponsables] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [selectedPross, setSelectedPross] = useState("");
    const [selectedRespo, setSelectedRespo] = useState("");
    const [Type, setType] = useState("");
    const [Status, setStatus] = useState("");
    const [Libelle, setLibelle] = useState("");
    const [Priorite, setPriorite] = useState("");
    const [Echeance, setEcheance] = useState("");
    const [Couts, setCouts] = useState("");
    
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
        
        console.log(
            Status,
            Libelle,
            Type,
            Priorite,
            Echeance,
            Couts
        );
        // Add your form submission logic here

        try{
            console.log('lets create!')
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/Actions/newActions',{
                method: 'POST',
                headers:  { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({Status, Libelle, Type, Priorite, Echeance, Couts })
            })
            if (response.ok){
                window.location.href = 'http://localhost:8000/Liste_des_Actions';
            }
        }
        catch(error){
            console.log('err == '+error)
        }
    };

    const handlePrioriteChange = (sub) => {
        
        setPriorite(sub);
    };
    const handleReset = () => {
        setStatus("");
        setLibelle("");
        setType("");
        setPriorite("");
        setEcheance("");
        setCouts("");
    };

    return (
        <div className="ActionForm">
            <h1> Nouvelle Audit</h1>
            <fieldset>
                <form action="#" method="get" onSubmit={(e) => handleSubmit(e)}>
                    <label for="respo">Resposable*</label>
                    <select
                        name="select"
                        id="select"
                        value={selectedPross}
                        onChange={(e) => setSelectedRespo(e.target.value)}
                        required
                    >
                        <option value="" disabled selected={selectedPross === ""}>
                            Nom de processus
                        </option>
                        {re.map((pros, index) => (
                            <option key={index} value={pros.name}>
                                {pros.name}
                            </option>
                        ))}
                    </select>
                    <label for="Libelle">Processes*</label>
                    <select
                        name="select"
                        id="select"
                        value={selectedPross}
                        onChange={(e) => setSelectedPross(e.target.value)}
                        required
                    >
                        <option value="" disabled selected={selectedPross === ""}>
                            Nom de processus
                        </option>
                        {processes.map((pros, index) => (
                            <option key={index} value={pros.name}>
                                {pros.name}
                            </option>
                        ))}
                    </select>
                    <label for="Type">Enter Type* </label>
                    <input
                        type="text"
                        name="Type"
                        id="Type"
                        value={Type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                        placeholder="Enter Type"
                        required
                    />
                    <label for="Priorite">
                    Set Priorite
                    </label>
                    <input
                        type="radio"
                        name="Priorite"
                        id="Forte"
                        checked={Priorite === "Forte"}
                        onChange={() =>
                            handlePrioriteChange("Forte")
                        }
                    />
                    Forte
                    <input
                        type="radio"
                        name="Priorite"
                        id="Importane"
                        checked={Priorite === "Importane"}
                        onChange={() =>
                            handlePrioriteChange("Importane")
                        }
                    />
                    Importane
                    <input
                        type="radio"
                        name="Priorite"
                        id="Moyenne"
                        checked={Priorite === "Moyenne"}
                        onChange={() =>
                            handlePrioriteChange("Moyenne")
                        }
                    />
                    Moyenne
                    <label for="Echeance">Enter Echeance*</label>
                    <input
                        type="Date"
                        name="Echeance"
                        id="Echeance"
                        onChange={(e) =>
                            setEcheance(e.target.value)
                        }
                        required
                    />
                   <label for="Couts">
                         Couts*
                    </label>
                    <input
                        type="number"
                        name="Couts"
                        id="Couts"
                        value={Couts}
                        onChange={(e) =>
                            setCouts(e.target.value)
                        }
                        placeholder="Enter Couts"
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
import React, { useState, useEffect } from 'react';
import "./NouvNC.css";

const NouvNC = () => {
    const [responsables, setResponsables] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [constat, setConstat] = useState("");
    const [origine, setOrigine] = useState("");
    const [constatdate, setConstatdate] = useState("");
    const [actionCor, setActionCor] = useState("");
    const [actionImm, setActionImm] = useState([]);
    const [type, setType] = useState([]);
    const [refQual, setRefQual] = useState([]);
    const [descriptionNC, setDescriptionNC] = useState("");
    const [selectedPross, setSelectedPross] = useState("");
    const [selectedRespo, setSelectedRespo] = useState([]);
    const [showDescription, setShowDescription] = useState(true);
    const [additionalActions, setAdditionalActions] = useState([]);
    const [lastSelectedRespo, setLastSelectedRespo] = useState([]);

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

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        if (!selectedRespo.includes(selectedValue)) {
            setSelectedRespo([...selectedRespo, selectedValue]);
            setLastSelectedRespo(selectedValue);
            console.log('list = ', [...selectedRespo, selectedValue]);
        }
    };

    const handleUndo = () => {
        setSelectedRespo(selectedRespo.filter(name => name !== lastSelectedRespo));
        setLastSelectedRespo(null); 
    };

    const addNewAction = () => {
        setActionImm([...actionImm, ""]);
    };
    
    const handleAdditionalActionChange = (e, index) => {
        const actions = [...actionImm];
        actions[index] = e.target.value;
        setActionImm(actions);
    };
    
    const removeAction = (index) => {
        const actions = [...actionImm];
        actions.splice(index, 1);
        setActionImm(actions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log('lets create!')
            const token = localStorage.getItem('token');
            const conf = {
                resp: selectedRespo,
                proce: selectedPross,
                const: constat,
                orig: origine,
                condate: constatdate,
                acorr: actionCor,
                aimm: actionImm,
                type: type,
                refqu: refQual
            };
            console.log('elrespo: ', conf.condate)
            const response = await fetch('http://localhost:3000/nconf/new', {
                method: 'POST',
                headers:  { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ conf })
            });
            if (response.ok) {
                handleReset();
                //window.location.href = 'http://localhost:8000/Liste_des_Actions';
            }
        }
        catch (error) {
            console.log('err == ' + error);
        }
    };

    const handleReset = () => {
        setConstat("");
        setOrigine("");
        setConstatdate("");
        setActionImm([]);
        setActionCor("");
        setDescriptionNC("");
        setType("");
        setRefQual("");
    };

    return (
        <div className="ncForm">
            <div className="backnc"></div>
            <h1>Déclaration du non conformité</h1>
            <fieldset>
                <form onSubmit={handleSubmit}>
                    <label>Processus</label>
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
                    <label htmlFor="constat">Constat*</label>
                    <input
                        type="text"
                        name="constat"
                        id="constat"
                        value={constat}
                        onChange={(e) => setConstat(e.target.value)}
                        placeholder="Constat"
                        required
                    />
                    <label htmlFor="constatdate">Date de constat*</label>
                    <input
                        type="date"
                        name="constatdate"
                        id="constatdate"
                        value={constatdate}
                        onChange={(e) => setConstatdate(e.target.value)}
                        required
                    />
                    <label htmlFor="actionCor">Action Corrective* </label>
                    <input
                        type="text"
                        name="actionCor"
                        id="actionCor"
                        value={actionCor}
                        onChange={(e) => setActionCor(e.target.value)}
                        placeholder="Action Corrective"
                        required
                    />

                    <div className="toggleButtons">
                        <button
                            type="button"
                            onClick={() => setShowDescription(true)}
                        >
                            Description de la NC
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDescription(false)}
                        >
                            Action Immédiates
                        </button>
                    </div>

                    {showDescription ? (
                        <div className="descriptionNC">
                            <label For="origin">Origine de non Conformite</label>
                            <input
                                list="origins"
                                name="origin"
                                id="origin"
                                value={origine}
                                onChange={(e) => setOrigine(e.target.value)}
                                placeholder="Origine de non Conformite"
                            />
                            <datalist id="origins">
                                <option value="Audit Intern">Audit Intern</option>
                                <option value="Audit Extern">Audit Extern</option>
                            </datalist>

                            <label htmlFor="Ref">Ref qualite</label>
                            <input
                                name="Ref"
                                id="Ref"
                                value={refQual}
                                onChange={(e) => setRefQual(e.target.value)}
                                placeholder="ref"
                            />
                            <label htmlFor="type">Type de non Conformite</label>
                            <input
                                list="types"
                                name="type"
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="Type de non Conformite"
                            />
                            <datalist id="types">
                                <option value="Mineur"></option>
                                <option value="Majeur"></option>
                            </datalist>
                            
                            <label htmlFor="respo">Responsable</label>
                            <select
                                name="respo"
                                id="respo"
                                value={lastSelectedRespo || ""}
                                onChange={handleSelectChange}
                            >
                                <option value="" disabled>
                                    Nom de Responsable
                                </option>
                                {responsables.map((pros, index) => (
                                    <option key={index} value={pros.name}>
                                        {pros.name}
                                    </option>
                                ))}
                            </select>
                            <br />
                            <input
                                type="text"
                                value={selectedRespo.join(", ")}
                                readOnly
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '5px',
                                    marginTop: '5px',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f0f0f0',
                                }}
                            />
                            <label htmlFor="Ref">Ref qualite</label>
                            <input
                                name="Ref"
                                id="Ref"
                                value={refQual}
                                onChange={(e) => setRefQual(e.target.value)}
                                placeholder="ref"
                            />
                            {selectedRespo.length > 0 && (
                                <button type="button" onClick={handleUndo}>Undo</button>
                            )}
                        </div>
                    ) 
                    <button
                        type="reset"
                        value="reset"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        value="Submit"
                    >
                        Submit
                    </button>
                </form>
            </fieldset>
        </div>
    );
};

export default NouvNC;

import './AuditInfo.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuditInfo = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [responsables, setResponsables] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [type, setType] = useState(audit.type || "");
    const [responsableId, setResponsableId] = useState(audit.responsableId || "");
    const [processus, setProcessus] = useState(audit.processus || "");
    const [planningDate, setPlanningDate] = useState(audit.planningDate || "");
    const [realisationDate, setRealisationDate] = useState(audit.realisationDate || "");
    const [lieu, setLieu] = useState(audit.lieu || "");
    const location = useLocation();
    const { audit } = location.state || {};
    console.log('audit = ', audit)

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
                console.error('Error fetching responsables:', error);
            }
        };

        fetchProcesses();
        fetchResponsables();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pdfFile) {
            alert('Please upload a PDF file.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', pdfFile);
            formData.append('id', audit.id);
            formData.append('responsableId', responsableId);
            formData.append('type', type);
            formData.append('processus', processus);
            formData.append('planningDate', planningDate);
            formData.append('realisationDate', realisationDate);
            formData.append('lieu', lieu);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/audits/edit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (response.ok) {
                window.location.href = 'http://localhost:8000/Liste_des_audits';
            } else {
                const errorData = await response.json();
                console.error('Error submitting form:', errorData);
                alert('Error submitting form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            alert('Please upload a valid PDF file.');
        }
    };

    return (
        <div className='auditinfo'>
            <div className='backauditinfo'></div>
            <h3>Informations d'Audit</h3>
            <form onSubmit={handleSubmit}>
                <div className="info-row">
                    <label>code:</label>
                    <input type="text" value={audit.code} disabled />
                </div>
                <div className="info-row">
                    <label>Responsable:</label>
                    <select 
                        name="responsable"
                        value={responsableId}
                        onChange={(e) => setResponsableId(e.target.value)}
                    >
                        <option value="">Select Responsable</option>
                        {responsables.map(resp => (
                            <option key={resp.id} value={resp.id}>{resp.name}</option>
                        ))}
                    </select>
                </div>
                <div className="info-row">
                    <label>Type:</label>
                    <select 
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select Type</option>
                        <option value="audit interne">Audit Interne</option>
                        <option value="audit externe">Audit Externe</option>
                    </select>
                </div>
                <div className="info-row">
                    <label>Processus:</label>
                    <select 
                        name="processus"
                        value={processus}
                        onChange={(e) => setProcessus(e.target.value)}
                    >
                        <option value="">Select Processus</option>
                        {processes.map(proc => (
                            <option key={proc.id} value={proc.name}>{proc.name}</option>
                        ))}
                    </select>
                </div>
                <div className="info-row">
                    <label>PlanningDate:</label>
                    <input type="text" name="planningDate" value={planningDate} onChange={(e) => setPlanningDate(e.target.value)} />
                </div>
                <div className="info-row">
                    <label>RealisationDate:</label>
                    <input type="text" name="realisationDate" value={realisationDate} onChange={(e) => setRealisationDate(e.target.value)} />
                </div>
                <div className="info-row">
                    <label>Lieu:</label>
                    <input type="text" name="lieu" value={lieu} onChange={(e) => setLieu(e.target.value)} />
                </div>
                <div className="info-row">
                    <label>PDF File:</label>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} required />
                </div>
                
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AuditInfo;

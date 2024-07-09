import './AuditInfo.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuditInfo = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [responsables, setResponsables] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [type, setType] = useState("");
    const [planningDate, setPlanningDate] = useState("");
    const [realisationDate, setRealisationDate] = useState("");
    const [lieu, setLieu] = useState("");
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


    const handleInputChange = (e) => {
      };
      
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
          formData.append('responsableId', audit.responsableId);
          formData.append('type', audit.type);
          formData.append('processus', audit.processus);
          formData.append('planningDate', audit.planningDate);
          formData.append('realisationDate', audit.realisationDate);
          formData.append('lieu', audit.lieu);
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
  
    
    return(
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
              <input type="text" name="responsable" value={audit.responsableId || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Type:</label>
              <input type="text" name="type" value={audit.type || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Processus:</label>
              <input type="text" name="processus" value={audit.processus || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>PlanningDate:</label>
              <input type="text" name="planningDate" value={audit.planningDate || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>RealisationDate:</label>
              <input type="text" name="realisationDate" value={audit.realisationDate || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Lieu:</label>
              <input type="text" name="lieu" value={audit.lieu || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>PDF File:</label>
              <input type="file" accept="application/pdf" onChange={handleFileChange} required />
            </div>
            
            <button type="submit">Submit</button>
          </form>
        </div>
    )
}

export default AuditInfo;
import './ListDaudit.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuditInfo = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [responsable, setResponsable] = useState("");
    const [type, settype] = useState("");
    const [responsable, setResponsable] = useState("");
    const [responsable, setResponsable] = useState("");
    const [responsable, setResponsable] = useState("");
    const [responsable, setResponsable] = useState("");
    const location = useLocation();
    const { audit } = location.state || {};
    console.log('audit = ', audit)

    

    const handleInputChange = (e) => {
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!pdfFile) {
            alert('Please upload a PDF file.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('responsable', responsable);
        formData.append('type', type);
        formData.append('processus', processus);
        formData.append('planningDate', planningDate);
        formData.append('realisationDate', realisationDate);
        formData.append('lieu', lieu);
    
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/Fichier/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (response.ok) {
                window.location.href = 'http://localhost:8000/Pilotage_du_processus';
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
          <h3>Informations</h3>
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
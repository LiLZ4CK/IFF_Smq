import './ListDaudit.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuditInfo = () => {
    const location = useLocation();
    const { audit } = location.state || {};
    console.log('audit = ', audit)

    

    const handleInputChange = (e) => {
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:3000/Fichier/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ info: audit })
          });
    
          if (response.ok) {
            window.location.href = 'http://localhost:8000/Pilotage_du_processus';
          } else {
            console.error('Failed to edit file:', response.statusText);
            // Handle error state or feedback to user
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle error state or feedback to user
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
              <input type="text" name="responsable" value={audit.type || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Processus:</label>
              <input type="text" name="processus" value={audit.processus || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>PlanningDate:</label>
              <input type="text" name="redacteur" value={audit.planningDate || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>RealisationDate:</label>
              <input type="text" name="redacteur" value={audit.realisationDate || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Lieu:</label>
              <input type="text" name="redacteur" value={audit.lieu || ''} onChange={handleInputChange} />
            </div>
            <div>
                        <label htmlFor="file">PDF File:</label>
                        <input type="file" accept="application/pdf" onChange={handleInputChange} required />
                    </div>
            
            <button type="submit">Submit</button>
          </form>
        </div>
    )
}

export default AuditInfo;
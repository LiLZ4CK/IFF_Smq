import './ListDaudit.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';

const AuditInfo = (audid) => {
    const [audit, setAudit] = useState('');
    const id = audid
    const editaudit = async() => {

        try {
          const response = await fetch(`http://localhost:3000/audits/one?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
      
          if (response.ok) {
            const data = await response.json();
            setAudit(data.audit);
          } else {
            console.error('Error:', await response.text());
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle error state o feedback to user
        }
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAudit(prev => ({
          ...prev,
          [name]: value
        }));
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
        <div>
            <div className="file-details">
          <h3>Informations</h3>
          <form onSubmit={handleSubmit}>
          <div className="info-row">
              <label>code:</label>
              <input type="text" value={audit.code} disabled />
            </div>
            <div className="info-row">
              <label>Rédacteur:</label>
              <input type="text" name="redacteur" value={audit.n || ''} onChange={handleInputChange} />
            </div>
            
            <button type="submit">Submit</button>
          </form>
        </div>
        </div>
    )
}

export default AuditInfo;
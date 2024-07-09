import './ListDaudit.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';

const AuditInfo = (audit) => {
    console.log('audit = ')

    

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
        <div>
            <div className="file-details">
          <h3>Informations</h3>
          <form onSubmit={handleSubmit}>
          <div className="info-row">
              <label>code:</label>
              <input type="text" value={audit.responsableId} disabled />
            </div>
            <div className="info-row">
              <label>Rédacteur:</label>
              <input type="text" name="redacteur" value={audit.responsableId || ''} onChange={handleInputChange} />
            </div>
            
            <button type="submit">Submit</button>
          </form>
        </div>
        </div>
    )
}

export default AuditInfo;
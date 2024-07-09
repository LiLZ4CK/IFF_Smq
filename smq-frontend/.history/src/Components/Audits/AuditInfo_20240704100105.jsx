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
            setAudits(data.audits);
          } else {
            console.error('Error:', await response.text());
            // Handle error state or feedback to user
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle error state or feedback to user
        }
      };
  
    
    return(
        <div></div>
    )
}

export default AuditInfo;
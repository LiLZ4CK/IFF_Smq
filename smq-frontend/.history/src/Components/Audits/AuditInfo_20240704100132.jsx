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
            console.error('Error:', 
        } catch (error) {
          console.error('Error:', error);
          // Handle error state o feedback to user
        }
      };
  
    
    return(
        <div></div>
    )
}

export default AuditInfo;
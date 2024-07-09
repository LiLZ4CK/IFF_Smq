import './ListDaudit.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';

const AuditsList = (audid) => {

    const editaudit = async(id) => {

        try {
          const response = await fetch(`http://localhost:3000/audits/one?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
      
          if (response.ok) {
            window.location.href = 'http://localhost:8000/audit_info';
          } else {
            console.error('Error:', await response.text());
            // Handle error state or feedback to user
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle error state or feedback to user
        }
      };
  
    
    return()
}

export default AuditsList;
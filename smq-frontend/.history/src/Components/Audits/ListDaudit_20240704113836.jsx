import './ListDaudit.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaFile } from 'react-icons/fa';
import { IoAddCircle } from "react-icons/io5";
import AuditInfo from "./AuditInfo";


const AuditsList = () => {
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  const filterAudits = (audits, filterValue) => {
    if (!filterValue) return audits; // No filter, return all audits

    return audits.filter(audit =>
      audit.type.toLowerCase().includes(filterValue.toLowerCase()) ||
      audit.processus.toLowerCase().includes(filterValue.toLowerCase()) ||
      audit.code.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/audits/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setAudits(data.audits);
          setFilteredAudits(data.audits); // Set initial filtered data to all audits
        } else {
          console.error("Failed to fetch audits:", response.statusText);
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAudits();
  }, []);

  const handleFilter = () => {
    const filteredData = filterAudits(audits, filterValue);
    setFilteredAudits(filteredData);
  };

  const addPdf = async(id) => {
    try{

    }
    catch(error){
      console.log('error: ',error)
    }
  }

  const openpdf = async (pdff) => {
    console.log('here is path: ', pdff)
    try {
      const response = await fetch('http://localhost:3000/audits/openpdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdff })
      });
  
      if (response.ok) {
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Open the PDF in a new tab using an <iframe>
        window.open(pdfUrl, '_blank');
      } else {
        console.error('Error:', await response.text());
        // Handle error state or feedback to user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error state or feedback to user
    }
  };
    function fixdate(datee) {
      const formattedDate = new Date(datee).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        
      });
      return formattedDate;
    }
    const auditsend = async (id) =>{
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
      AuditInfo(id);
    }
    
  return (
    
    <div className="audits-list">
    <div>
    <a className="newAudit" href="/Nouvel_audit" >nouvel audit</a></div>
     <div className="filter">
  <input
    type="text"
    placeholder="Filter par Code, Type ou Processus"
    value={filterValue}
    onChange={e => setFilterValue(e.target.value)}
  />
  <button onClick={handleFilter}>Filter</button>
      </div>

      {/* Table header row */}
      <div className="audit-header">
        <p>Code</p>
        <p>Type d'Audit</p>
        <p>Processus</p>
        <p>Date de réalisation</p>
        <p>Lieu</p>
        <p>Voir</p>
        <p>Rapport</p>
      </div>

      {/* Map through filtered audits and display information */}
      {filteredAudits.map(audit => (
        <div key={audit.id} className="audit">
          <p><button style={{
            backgroundColor: 'rgb(102, 83, 96)', 
            color: 'white', fontSize: '18px' ,
            width: '170px',height: '30px'}} 
            onClick={() => auditsend(audit.id)}>{audit.code}</button>
          </p>
          <p>{audit.type}</p>
          <p>{audit.processus}</p>
          <p>{fixdate(audit.realisationDate)}</p>
          <p>{audit.lieu}</p>
          <p>
            {audit.status === 2 ? (
              <button style={{
                color: 'green',
                height: '1px',
                fontSize: '30px',
                textOverflow: 'ellipsis',
                backgroundColor: 'transparent',
              }} onClick={() => openpdf(audit.path)}>
                <FaEye />
              </button >
            ) : (
              <button style={{
                color: 'grey',
                height: '1px',
                fontSize: '30px',
                textOverflow: 'ellipsis',
                backgroundColor: 'transparent',}} onClick={() => addPdf(audit.path)}>
                <IoAddCircle />
              </button>
            )}
          </p>
          <p>
            <button>
              <FaFile />
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default AuditsList;
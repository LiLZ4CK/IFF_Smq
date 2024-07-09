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
  
    
    return(
        <div>
            <div className="file-details">
          <h3>Informations</h3>
          <form onSubmit={handleSubmit}>
            <div className="info-row">
              <label>Rédacteur:</label>
              <input type="text" name="redacteur" value={selectedFile.redacteur || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Créé le:</label>
              <input type="text" value={new Date(selectedFile.dateCreation).toLocaleDateString()} disabled />
            </div>
            <div className="info-row">
              <label>Type de document:</label>
              <input type="text" name="typeDoc" value={selectedFile.typeDoc || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Processus:</label>
              <input type="text" name="processus" value={selectedFile.processus || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Nature de document:</label>
              <input type="text" name="natureDoc" value={selectedFile.natureDoc || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Produits:</label>
              <input type="text" name="produit" value={selectedFile.produit || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Services:</label>
              <input type="text" name="service" value={selectedFile.service || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Complément:</label>
              <input type="text" name="compleme" value={selectedFile.compleme || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Commentaire:</label>
              <input type="text" name="commentaire" value={selectedFile.commentaire || ''} onChange={handleInputChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        </div>
    )
}

export default AuditInfo;
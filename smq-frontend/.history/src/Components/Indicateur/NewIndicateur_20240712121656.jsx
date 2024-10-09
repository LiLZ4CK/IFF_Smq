import React, { useState } from 'react';
import "./NewIndicateur.css";

const NewIndicateur = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', border: '1px solid #ccc' }}>
          <h2>Nouvelle Action</h2>
    
          <form>
            <div style={{ marginBottom: '10px' }}>
              <label>Titre de l'Action</label>
              <input type="text" style={{ width: '100%', padding: '8px' }} />
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Type d'Action</label>
              <input type="text" style={{ width: '100%', padding: '8px' }} />
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Description</label>
              <textarea style={{ width: '100%', padding: '8px' }} rows="3"></textarea>
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Échéance prévisionnelle</label>
              <input type="date" style={{ width: '100%', padding: '8px' }} />
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Priorité</label>
              <select style={{ width: '100%', padding: '8px' }}>
                <option value="1">1 - Urgente</option>
                <option value="2">2 - Importante</option>
                <option value="3">3 - Moyenne</option>
                <option value="4">4 - Faible</option>
              </select>
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Origine</label>
              <input type="text" style={{ width: '100%', padding: '8px' }} />
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Constat</label>
              <textarea style={{ width: '100%', padding: '8px' }} rows="3"></textarea>
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Objectifs à atteindre</label>
              <textarea style={{ width: '100%', padding: '8px' }} rows="3"></textarea>
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Chargé de l'Action</label>
              <input type="text" style={{ width: '100%', padding: '8px' }} />
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Personnes Informées</label>
              <input type="text" style={{ width: '100%', padding: '8px' }} />
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Souhaitez-vous mesurer l'efficacité?</label>
              <select style={{ width: '100%', padding: '8px' }}>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>
    
            <div style={{ marginBottom: '10px' }}>
              <label>Pièce jointe</label>
              <input type="file" style={{ width: '100%' }} />
            </div>
    
            <div>
              <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>Sauvegarder</button>
              <button type="reset" style={{ padding: '10px 20px' }}>Annuler</button>
            </div>
          </form>
        </div>
      );

}
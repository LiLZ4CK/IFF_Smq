import React, { useState } from 'react';
import "./NewIndicateur.css";

const NewIndicateur = () => {
    return (
        <div className="form-container">
          <h2>Nouvelle Indicateur</h2>
          <form>
            <div className="form-row">
              <div className="form-group left">
                <label>Titre de l'Action</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group right">
                <label>Type d'Action</label>
                <input type="text" className="form-control" />
              </div>
            </div>
    
            <div className="form-row">
              <div className="form-group left">
                <label>Description</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>
              <div className="form-group right">
                <label>Échéance prévisionnelle</label>
                <input type="date" className="form-control" />
              </div>
            </div>
    
            <div className="form-row">
              <div className="form-group left">
                <label>Priorité</label>
                <select className="form-control">
                  <option value="1">1 - Urgente</option>
                  <option value="2">2 - Importante</option>
                  <option value="3">3 - Moyenne</option>
                  <option value="4">4 - Faible</option>
                </select>
              </div>
              <div className="form-group right">
                <label>Origine</label>
                <input type="text" className="form-control" />
              </div>
            </div>
    
            <div className="form-row">
              <div className="form-group left">
                <label>Constat</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>
              <div className="form-group right">
                <label>Objectifs à atteindre</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>
            </div>
    
            <div className="form-row">
              <div className="form-group left">
                <label>Chargé de l'Action</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group right">
                <label>Personnes Informées</label>
                <input type="text" className="form-control" />
              </div>
            </div>
    
            <div className="form-row">
              <div className="form-group left">
                <label>Souhaitez-vous mesurer l'efficacité?</label>
                <select className="form-control">
                  <option value="yes">Oui</option>
                  <option value="no">Non</option>
                </select>
              </div>
              <div className="form-group right">
                <label>Pièce jointe</label>
                <input type="file" className="form-control" />
              </div>
            </div>
    
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">Sauvegarder</button>
              <button type="reset" className="btn btn-secondary">Annuler</button>
            </div>
          </form>
        </div>
      );
    };
    
export default NewIndicateur;
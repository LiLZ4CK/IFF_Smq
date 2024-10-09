import React from 'react';
import './Cartographie.css';

const Cartographie = () => {
    return (
        <div className='Cartographie'>
            <div className='back'></div>
            <div className='Management'>
                <div className='buttons'>
                    <a href='/GED' className='button'>Stratigie et pilotage</a>
                    <a href='/management-de-qualite' className='button'>Management de qualité</a>
                </div>
                <h2>Management</h2>
            </div>

            <div className='BesoinClient'>
                <a href='/besoin-client' className='button'>BESOIN CLIENT</a>
            </div>

            <div className='Realisation'>
                <div className='buttons'>
                    <a href='/gestion-relation-client' className='button'>Gestion Relation Client</a>
                    <a href='/ingenierie-de-formation' className='button'>Ingénierie de Formation</a>
                    <a href='/planification' className='button'>Planification et Realisation des Formation</a>
                </div>
                <h2>Realisation</h2>
            </div>

            <div className='SatisfactionClient'>
                <a href='/satisfaction-client' className='button'>SATISFACTION CLIENT</a>
            </div>

            <div className='Support'>
                <div className='buttons'>
                    <a href='/achat-et-logistique' className='button'>Achat et logistique</a>
                    <a href='/installation-equipment' className='button'>Installation équipment hygiene et securité</a>
                    <a href='/gestion-connaissances' className='button'>Gestion des connaissances et des compétences</a>
                    <a href='/finances-et-comptabilite' className='button'>Finance et comptabilité</a>
                </div>
                <h2>Support</h2>
            </div>
        </div>
    )
};

export default Cartographie;

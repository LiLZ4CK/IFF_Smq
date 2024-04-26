import React from 'react';
import './Cartographie.css'; // Importing the CSS file

const Cartographie =() => {
    const handleStratigeEtPilotage = () => {}
    const handleManagementDeQualite = () => {}
    const handleBesoinClient = () => {}
    const handleGestionRelationClient = () => {}
    const handleIngénierieDeFormation = () => {}
    const handlePlanification = () => {}
    const handleSatisfactionClient = () => {}
    const handleAchatEtLogistique = () => {}
    const handleInstalationEquipment = () => {}
    const handleGestionConnaissances = () => {}
    const handleFinancesEtComptabilité = () => {}
    
    return(
        <div className='Cartographie'>
            <div className='back'></div>
            <div className='Management'>
                    <div className='buttons'>
                        <button onClick={handleStratigeEtPilotage}>Stratigie et pilotage</button>
                        <button onClick={handleManagementDeQualite}>Management de qualité</button>
                    </div>
                <h2>Management</h2>
            </div>

            <div className='BesoinClient'>
                <button onClick={handleBesoinClient}>BESOIN CLIENT</button>
            </div>

            <div className='Realisation'>
                <div className='buttons'>
                <button onClick={handleGestionRelationClient}>Gestion Relation Client</button>
                <button onClick={handleIngénierieDeFormation}>Ingénierie de Formation</button>
                <button onClick={handlePlanification}>Planification et Realisation des Formation</button>
            </div>
                <h2>Realisation</h2>
            </div>

            <div className='SatisfactionClient'>
                <button onClick={handleSatisfactionClient}>SATISFACTION CLIENT</button>
            </div>

            <div className='Support'>
                <div className='buttons'>
                    <button onClick={handleAchatEtLogistique}>Achat et logistique</button>
                    <button onClick={handleInstalationEquipment}>Installation équipment hygiene et securité</button>
                    <button onClick={handleGestionConnaissances}>Gestion des connaissances et des compétences</button>
                    <button onClick={handleFinancesEtComptabilité}>Finance et comptabilité</button>
                </div>
                <h2>Support</h2>
            </div>

        </div>
    )
};
export default Cartographie;

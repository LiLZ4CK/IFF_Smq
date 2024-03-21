import React from 'react';
import './DashboardForm.css';
import { IoSettingsSharp  } from "react-icons/io5";

const Sublinks = [
  { label: 'Non Conformité', link1: 'Nouvelle NC', link2: 'List des NC', link3: 'Indicateur NC' },
  { label: 'Actions', link1: 'List des Actions', link2: 'Plan d\'actions', link3: 'Indicateur actions' },
  { label: 'Audits', link1: 'Nouvelle Audit', link2: 'List des audits', link3: 'Planning des audits' },
  { label: 'GED', link1: 'GED', link2: 'Acces au documents' },
];
const rep = (text) => text.replace(/\s+/g, '_');

function DashboardForm() {
 // const fetchuserrole = async 
  return (
  <div className="Dashboardform">
  <div className="app">
  <header className="header">
    <a className='sett' href="/settings">
      <IoSettingsSharp className="icon" />
          </a>
    {/* Add logo, title, and other header elements here */}
  </header>
  <div className="header-buttons">
    <div class="Head">
      <a class="header-button" href="Cartographie_des_processus">Cartographie des processus</a>
      <a class="header-button" href="Cartographie_des_processus">Pilotage du processus</a>
      <a class="header-button" href="Cartographie_des_processus">Gestion des risques</a>
    </div>
  </div>
  <div className="nav-container">
    <div className="nav-table-container">
      {Sublinks.map((sublink, index) => (
        <div className="nav-table" key={index}>
          <h2>{sublink.label}</h2>
          <ul>
            <li><a href={rep(sublink.link1)} className="custom-link">{sublink.link1}</a></li>
            <li><a href={rep(sublink.link2)} className="custom-link">{sublink.link2}</a></li>
            {sublink.link3 && <li><a href={rep(sublink.link3)} className="custom-link">{sublink.link3}</a></li>}
          </ul>
        </div>
      ))}
    </div>
  </div>
</div>

    </div>

  );
}

export default DashboardForm;
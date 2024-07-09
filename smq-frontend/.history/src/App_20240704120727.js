import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import Setting from './Components/Settings/Settings';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import DashboardForm from './Components/DashboardForm/DashboardForm';
import VerificationForm from './Components/VerificationForm/VerificationForm';
import ListDaudit from './Components/Audits/ListDaudit';
import NewAudit from './Components/Audits/NewAudit';
import AuditInfo from './Components/Audits/AuditInfo';
import ListDaction from './Components/Actions/ListDaction';
import XXX from './Components/XXX/XXX';
import PilotageProc from './Components/PilotageProc/PilotageProc';
import AddFichier from './Components/PilotageProc/AddFichier';
import Notif from './Components/Notification/Notif';
import NouvNC from './Components/NC/NouvNC';
import ListNoconf from './Components/NC/NCList';
import GestRisques from './Components/GestRisques/GestRisques';
import NewAction from './Components/Actions/NewAction';
import Cartographie from './Components/Cartographie/Cartographie';
import GED from './Components/GED/GED';
import Logo from '../src/Components/Assets/logo_iff.svg';
import Boraq from '../src/Components/Assets/boraq.png';
import Afaq from '../src/Components/Assets/afaq.png';
import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { IoSettingsSharp, IoLogOutOutline, IoNotifications } from 'react-icons/io5';
import { HiQuestionMarkCircle } from "react-icons/hi";
import PlanningDauit from './Components/Audits/PlanningDaudit'
import { loadCldr} from '@syncfusion/ej2-base';

loadCldr(
 require('cldr-data/supplemental/numberingSystems.json'),
 require('cldr-data/main/fr-CH/ca-gregorian.json'),
 require('cldr-data/main/fr-CH/numbers.json'),
 require('cldr-data/main/fr-CH/timeZoneNames.json')
  );




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [settisOpen, setIsOpen] = useState(false);
  const [notifisOpen, notIsOpen] = useState(false);
  const [name, setName] = useState('');


  const toggleSettings  = () => {
    if (notifisOpen) {
      notIsOpen(false); // Close settings if it's open
    }
    setIsOpen(!settisOpen);
  };

  const toggleNotif = () => {
    if (settisOpen) {
      setIsOpen(false); // Close settings if it's open
    }
    notIsOpen(!notifisOpen); // Toggle notification
  };
  useEffect(() => {
    // Check if user is already logged in
    //Notif();
    const checkerr = async () => {

      const loggedInStatus = localStorage.getItem('isLoggedIn');
      if (loggedInStatus === 'true') {
      try{
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/check', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        })
        if (response.ok){
          const data = await response.json();
          setName(data.username);
        }
        else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
      catch(error){
        console.error(error);
      }
      setIsLoggedIn(true);
    }
    setIsLoading(false); // Set loading to false after checks
  }
  checkerr();
  }, []);


  return (
    <Router>
        <>
          <img class='image' src={Logo} className="App-logo" alt="logo"/>
          <img className='boraq' src={Boraq} alt="logo" />
          <img className='afaq' src={Afaq} alt="logo" />
          <>
    </>
        </>
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        
        <>
          {/* Your logo images */}
          {isLoggedIn && (
        <Navbar>
            <Container className='Navbar'>
              <Navbar.Brand className="quali" href="/">QualIFF</Navbar.Brand>
              <div className="Name">{name}</div>
              <button className="info"><HiQuestionMarkCircle className="icon" /></button>
              <button className="notifo" onClick={toggleNotif}><IoNotifications className="icon" /></button>
                {notifisOpen && <Notif />}
              <button className="sett" onClick={toggleSettings}>
        <IoSettingsSharp className="icon" />
              </button>
                {settisOpen && (
                  <ul className="settings-list">
                    <li>
                      <a href="/dashboard">Account Settings</a>
                    </li>
                    <li className="logout-option">
                      <a href="/dashboard" onClick={() => {
                        // Implement logout logic here (e.g., clear session data, redirect)
                        alert('Are you sure you want to log out?'); // Placeholder for confirmation
                      }}>
                        <IoLogOutOutline className="logout-icon" />
                        Log Out
                      </a>
                    </li>
                  </ul>
                )}
          </Container>
              {/* Add logo, title, and other header elements here */}
          </Navbar>
      )}
          <div className="global-background"> {/* Container for background */}
      </div>
          <Routes>
            {!isLoggedIn && (
              <>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="*" element={<LoginForm />} />
              </>
            )}
            {isLoggedIn && (
              <>
                <Route path="/register" element={<Navigate to="/dashboard" />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route
                  path="/dashboard"
                  element={isLoggedIn ? <DashboardForm /> : <Navigate to="/" />}
                />
                <Route
                  path="/settings"
                  element={isLoggedIn ? <Setting /> : <Navigate to="/" />}
                />
                <Route
                  path="/Liste_des_Actions"
                  element={isLoggedIn ? <ListDaction /> : <Navigate to="/" />}
                />
                <Route
                  path="/Liste_des_audits"
                  element={isLoggedIn ? <ListDaudit /> : <Navigate to="/" />}
                />
                <Route
                  path="/Liste_des_audits"
                  element={isLoggedIn ? <ListDaudit /> : <Navigate to="/" />}
                />
                <Route
                  path="/Nouvel_Audit"
                  element={isLoggedIn ? <NewAudit /> : <Navigate to="/" />}
                />
                <Route
                  path="/Planning_des_audits"
                  element={isLoggedIn ? <PlanningDauit /> : <Navigate to="/" />}
                />
                <Route
                  path="/Pilotage_du_processus"
                  element={isLoggedIn ? <PilotageProc /> : <Navigate to="/" />}
                />
                <Route
                  path="/Add_Ficher"
                  element={isLoggedIn ? <AddFichier /> : <Navigate to="/" />}
                />
                <Route
                  path="/Gestion_des_risques"
                  element={isLoggedIn ? <GestRisques /> : <Navigate to="/" />}
                />
                <Route
                  path="/Cartographie_des_processus"
                  element={isLoggedIn ? <Cartographie /> : <Navigate to="/" />}
                />
                <Route path="/GED" element={isLoggedIn ? <GED /> : <Navigate to="/" />} />
                <Route path="/Nouvelle_NC" element={isLoggedIn ? <NouvNC /> : <Navigate to="/" />} />
                <Route path="/List_des_NC" element={isLoggedIn ? <ListNoconf /> : <Navigate to="/" />} />
                <Route path="/newAction" element={isLoggedIn ? <NewAction /> : <Navigate to="/" />} />
              </>
            )}
            <Route path="/VerificationForm/:token" element={<VerificationForm />} />
            <Route path="/VerificationForm" element={<VerificationForm />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
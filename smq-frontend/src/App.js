import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import Setting from './Components/Settings/Settings';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import DashboardForm from './Components/DashboardForm/DashboardForm';
import VerificationForm from './Components/VerificationForm/VerificationForm';
import ListDaudit from './Components/Audits/ListDaudit'
import GED from './Components/GED/GED'
import Logo from '../src/Components/Assets/logo_iff.svg';
import Boraq from '../src/Components/Assets/boraq.png';
import Afaq from '../src/Components/Assets/afaq.png';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
        <>
          <img class='image' src={Logo} className="App-logo" alt="logo" />
          <img className='boraq' src={Boraq} alt="logo" />
          <img className='afaq' src={Afaq} alt="logo" />
        </>
      <Routes>
        {!isLoggedIn && (<>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={<LoginForm />} />
        </>
        )}
        {isLoggedIn &&
        (
          <>
        <Route path="/register" element={<Navigate to="/dashboard" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn ? <DashboardForm /> : <Navigate to="/" />} />
        <Route path="/settings" element={isLoggedIn ? <Setting /> : <Navigate to="/" />} />
        <Route path="/List_des_audits" element={isLoggedIn ? <ListDaudit /> : <Navigate to="/" />} />
        <Route path="/GED" element={isLoggedIn ? <GED /> : <Navigate to="/" />} />
        </>
        )}
        <Route path="/VerificationForm/:token" element={<VerificationForm />} />
        <Route path="/VerificationForm" element={<VerificationForm />} />
      </Routes>
    </Router>
  );
}

export default App;

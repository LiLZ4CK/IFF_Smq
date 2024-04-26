import React, { useState } from 'react';
import './Settings.css'; // Importing the CSS file

const SettingsPage = () => {
  const [changeName, setChangeName] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const token = localStorage.getItem('token');
  const handleNameChange = () => {
    setChangeName(true);
    setChangePassword(false);
  };

  const handlePasswordChange = () => {
    setChangeName(false);
    setChangePassword(true);
  };

  const handleNameSubmit = async(event) => {
    event.preventDefault();
    setNewName('');
    setConfirmPassword('');
	try{
		const response = await fetch('http://localhost:3000/changename', {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
			body: JSON.stringify({newName, confirmPassword})
		})
		if (response.ok) {
			console.log("Login successful!");
			window.location.href = 'http://localhost:8000/settings';
		} else {
			const errorMessage = await response.text();
            console.error("Change name failed:", response.statusText);
            alert(errorMessage)
		}
	}
	catch(error) {
		console.error("Error:", error);
	}
  };
  const handleLogout= async(event) =>{
    event.preventDefault();
    try{
      localStorage.setItem('token', null)
      localStorage.setItem('isLoggedIn', 'false')
      localStorage.clear();
      window.location.href = 'http://localhost:8000/';
    } catch (error) {
      console.error("Error:", error);
  }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
	try{
		setOldPassword('');
		setNewPassword('');
		setConfirmPassword('');

		const response = await fetch('http://localhost:3000/changepass', {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
			body: JSON.stringify({oldPassword, newPassword, confirmPassword})
		})
		if (response.ok) {
			console.log("Login successful!");
			window.location.href = 'http://localhost:8000/settings';
		} else {
      const errorMessage = await response.text();
      console.error("change password  failed:", response.statusText);
      alert(errorMessage)		}
	}
	catch(error) {
		console.error("Error:", error);
	}
  };

  return (
    <div className="settings"> {/* Applying the 'container' class */}
      <h2>User Settings</h2>
      <div className="button-container"> {/* Applying the 'button-container' class */}
        <button onClick={handleNameChange}>Change Name</button>
        <button onClick={handlePasswordChange}>Change Password</button>
        <buttona onClick={handleLogout}>Log out</buttona>
      </div>
      {changeName && (
        <form className="form-container" onSubmit={handleNameSubmit}> {/* Applying the 'form-container' class */}
          <input type="text" placeholder="New Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit">Update Name</button>
        </form>
      )}
      {changePassword && (
        <form className="form-container" onSubmit={handlePasswordSubmit}> {/* Applying the 'form-container' class */}
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit">Update Password</button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;

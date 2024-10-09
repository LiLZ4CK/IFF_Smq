import React, { useEffect, useState } from 'react';
import './DashboardForm.css';

const Sublinks = [
  { label: 'Non Conformité', link1: 'Nouvelle NC', link2: 'List des NC', },
  { label: 'Actions', link1: 'Liste des Actions', link2: 'Plan d\'actions', link3: 'Indicateur actions' },
  { label: 'Audits',  link1: 'Liste des audits', link2: 'Planning des audits' },
  { label: 'GED', link1: 'GED', link2: 'Acces au documents' },
  { label: 'Indicateur',link1: 'Nouvel indicateur', link2: 'Indicateur de performance' },
];

const rep = (text) => text.replace(/\s+/g, '_');

function DashboardForm() {
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/dashboard', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
  
        if (response.ok) {
          const data = await response.json();
          setRole(data.rol.name); // Update role state with fetched data
          if (role === 'admin'){
            setUsers(data.users);
          }
        } else {
          localStorage.removeItem('token');
          localStorage.setItem('isLoggedIn', false);
          console.error("Failed to fetch audits:", response.statusText);
          // Handle error, redirect user, etc.
        }
      } catch (error) {
        console.error("Error1:", error);
      }
    };
  
    fetchElements();
  }, [role]);
  const handleRoleChange = async (userId, newRole) => {
    // Implement logic to update user role on server using userId and newRole
    // This might involve another fetch request with user data and updated role
    // Update the local users state after successful update on server
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  }
 // const fetchuserrole = async 
  if (role === 'admin' || role === 'user'){
    return (
      <div className="Dashboardform">
  <div className="header-buttons">
    <div class="Head">
      <a class="header-button" href="Cartographie_des_processus">Cartographie des processus</a>
      <a class="header-button" href="Pilotage_du_processus">Pilotage du processus</a>
      <a class="header-button" href="Gestion_des_risques">Gestion des risques</a>
      <a class="header-button" href="Jornal_dam">Journal d'amelioration (plan d'action)</a>
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

);
  }
  else if (role === 'admin'){ //admin
    return (
      <div className="Dashboardform">
        {role === 'admin' && (
          <div className="app">
            <div className="nav-container">
              <div className="nav-table-container">
                <h2>Users</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.role?.name}</td>  {/* Access nested role name */}
                        <td>
                          <select value={user.role?.name} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                            <option value="user">User</option>
                            <option value="guest">Guest</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardForm;
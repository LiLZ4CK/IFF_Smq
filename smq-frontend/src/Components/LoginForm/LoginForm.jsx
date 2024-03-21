import React, { useState } from "react";
import './LoginForm.css';
import { FaLock, FaUser } from "react-icons/fa";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), 
            });
    
            if (response.ok) {
                console.log("Login successful!");
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'http://localhost:8000/dashboard';
            } else {
                const errorMessage = await response.text();
                console.error("Register failed:", response.statusText);
                alert(errorMessage)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="Loginform">
        <div className="wrapper">
            <div><h3><ul>
                <a href="/register">Registre</a>
            </ul></h3></div>
            <form onSubmit={handleSubmit}>
                <h1>Se Connecter</h1>
                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <FaUser className="icon"/>
                </div>

                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder='Mot de passe' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <FaLock className="icon" />
                </div>
                <button type="submit">Se Connecter</button>
            </form>
        </div>
        </div>
    )
}

export default LoginForm;

import React, { useState } from "react";
import './LoginForm.css';
import Qualiff from '../Assets/Logo QualIff couleur.png';
import Iff from '../Assets/iffff.jpg';

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
        <div className="login-form">
            <div className="login-form-container">
            <img
                src={Qualiff}
                alt="QualIFF Logo"
                style={{ height: '260px', width: 'auto' }} // Adjust the size as needed
              />
            <img
                src={IFf}
                alt="IFF Image"
                style={{ height: '260px', width: 'auto' }} // Adjust the size as needed
              />
                <p>Bienvenue</p>
                
                <a href="/register" className="register-link">Register</a>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder='Email' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder='Password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="remember-me">
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <a href="/forgot-password" className="forgot-password">mot de passe oublier</a>
            </div>
        </div>
    );
}

export default LoginForm;
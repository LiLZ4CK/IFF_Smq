import React, { useState } from "react";
import './LoginForm.css';
import Qualiff from '..//Components/Assets/Logo QualIff couleur.png';

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
            <div className="form-container">
                <h1>Qualiff</h1>
                <p>Bienvenue</p>
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
                <a href="/register" className="register-link">Register</a>
                <a href="/forgot-password" className="forgot-password">mot de passe oublier</a>
            </div>
        </div>
    );
}

export default LoginForm;
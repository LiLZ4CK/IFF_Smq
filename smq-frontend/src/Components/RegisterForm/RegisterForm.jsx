import React from "react";
import { useState } from "react";
import './RegisterForm.css';


const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmation) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            console.log('lets go')
            const response = await fetch ('http://localhost:3000/register',{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({name, email, password, confirmation}),
            });
            if (response.ok){
                console.log("Register successful!");
                window.location.href = 'http://localhost:8000/VerificationForm';
            } else {
            const errorMessage = await response.text();
            console.error("Register failed:", response.statusText);
            alert(errorMessage)
            }
        } catch (error) {
        console.error("Error:", error);
        }
    }
    return (
        <div className="Registerform">

        <div className="wrapper">
        <div><h3><ul>
                <a href="/">Se Connecter</a>
            </ul></h3></div>
            <form onSubmit={handleSubmit}>
                <h1>Registre</h1>
                <div className="input-box">
                    <input 
                        type="text"
                        placeholder='Nom et prénom'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="password"
                        placeholder='Mot de passe'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Confirmez le mot de passe'
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        required
                    />
                </div>
            <button type="submit">registre</button>
            </form>
        </div>
                        </div>
    )
}


export default RegisterForm;
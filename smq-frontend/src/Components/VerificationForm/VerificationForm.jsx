import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './VerificationForm.css';

const VerificationForm = () => {
    const { token } = useParams();
    const [verification, setVerification] = useState("");
    const [email, setEmail] = useState("");
    const [isTokenSent, setIsTokenSent] = useState(false);

    useEffect(() => {
        // Check if token exists in URL
        if (token) {
            // If token exists, send it to backend
            sendTokenToBackend(token);
            // Set flag to indicate token is sent
            setIsTokenSent(true);
        }
    }, [token]);

    const sendTokenToBackend = async (token) => {
        try {
            const response = await fetch(`http://localhost:3000/Verifylink/${token}`, {method: 'POST'});
            if (response.ok) {
                console.log("Verification successful");
                // Redirect upon successful verification
                window.location.href = 'http://localhost:8000/';
            } else {
                console.error("Verification failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/Verifycode/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verification, email }), 
            });
            if (response.ok) {
                console.log("Verification successful");
                // Redirect upon successful verification
                window.location.href = 'http://localhost:8000/';
            } else {
                console.error("Verification failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // If token is already sent via URL, don't render the form until it's verified
    if (isTokenSent) {
        return (
            <div className="mailverification">
                <div className="wrapper">
                    <h1>Verifying...</h1>
                </div>
            </div>
        );
    }

    // Render the form if token is not sent via URL or after it's verified
    return (
        <div className="mailverification">
            <div className="wrapper">
                <div>
                    <h3>
                        <ul>
                            Didn't receive code? <a href="/register">Try Register again</a>
                        </ul>
                    </h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Verify your email</h1>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder='Email' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder='Verification code' 
                            value={verification} 
                            onChange={(e) => setVerification(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Verify</button>
                </form>
            </div>
        </div>
    );
}

export default VerificationForm;

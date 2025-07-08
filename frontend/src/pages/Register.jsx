import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import authenticationImage from "../assets/Authentication.jpg";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axios.post("/auth/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-form-section">
                    <h2 className="auth-heading">Register</h2>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <div className="auth-error">{error}</div>}
                        <button type="submit">Register</button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <a href="/login">Login</a>
                    </div>
                </div>

                <div className="auth-image-section">
                    <img
                        src={authenticationImage}
                        alt="Authentication Illustration"
                    />
                </div>
            </div>
        </div>
    );
}

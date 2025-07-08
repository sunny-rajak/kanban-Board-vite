import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import authenticationImage from "../assets/Authentication.jpg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-form-section">
                    <h2 className="auth-heading">Login</h2>
                    <form onSubmit={handleSubmit} className="auth-form">
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
                        <button type="submit">Login</button>
                    </form>
                    <div className="auth-footer">
                        Don't have an account? <a href="/register">Register</a>
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

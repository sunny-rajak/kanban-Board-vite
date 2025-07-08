import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header({ currentUser, setCurrentUser }) {
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setCurrentUser(null);
        setShowLogout(false);
        navigate("/login");
    };

    return (
        <div className="header-container">
            <h2 className="header-title">Kanban Board</h2>

            {currentUser ? (
                <div
                    className="user-section"
                    onClick={() => setShowLogout((prev) => !prev)}
                >
                    <FaUserCircle className="user-icon" />
                    <span>{currentUser.username}</span>

                    {showLogout && (
                        <div className="logout-dropdown">
                            <button
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <a href="/login" className="login-link">
                    <FaUserCircle className="user-icon" />
                    <span>Login</span>
                </a>
            )}
        </div>
    );
}

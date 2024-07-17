import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Homepagenavbar.scss'; // Import your CSS file


const HomeNavbar = ({ user, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="nav">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Logo
                </Link>
                <div className="nav-icon" onClick={toggleMenu}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>
                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {user?.username ? (
                        <>
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-links" onClick={toggleMenu}>
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/leaderboard" className="nav-links" onClick={toggleMenu}>
                                    Leaderboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/profile/${user.username}`} className="nav-links" onClick={toggleMenu}>
                                    Profile
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => { handleLogout(); toggleMenu(); }} className="nav-links">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link to="/auth" className="nav-links" onClick={toggleMenu}>
                                LOGIN
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default HomeNavbar;

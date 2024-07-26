import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Homepagenavbar.scss'; // Import your CSS file
import codaez from '../../assets/codaez.png';


const HomeNavbar = ({ user, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="nav">
            <div className="nav-container">
                <Link className='logo-link' to={'/'}>
                    <img src={codaez} alt="" />
                    <span>Cod<span className="purple">a</span>e<span className="purple">z</span></span>
                </Link>
                {/* <div className="nav-icon" onClick={toggleMenu}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div> */}
                {
                    user?.username ? (
                        <div className='nav-icon' onClick={toggleMenu}>
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </div>
                    ) : (
                        <div className='nav-icon'>
                            <Link to="/auth" className="nav-links">
                                Login
                            </Link>
                        </div>
                    )
                }
                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {(user && Object.keys(user).length > 0) ? (
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
                        // if user is not looged in don;y show hamburger show Login only

                        <li className="nav-item">
                            <Link to="/auth" className="nav-links" onClick={toggleMenu}>
                                Login
                            </Link>
                        </li>

                    )}
                </ul>
            </div>
        </nav>
    );
}

export default HomeNavbar;

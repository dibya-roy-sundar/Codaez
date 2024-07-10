import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import profile icon from React Icons
import './Box.scss'; // Import your CSS file

const GlowingBox = () => {
    return (
        <div className="glowing-box">
            {/* Box faces with profile icons */}
            <div className="box-face right-side">
                <div className="image-container">
                    <FaUserCircle className="profile-icon" />
                </div>
            </div>
            <div className="box-face front">
                <div className="image-container">
                    <FaUserCircle className="profile-icon" />
                </div>
            </div>
            <div className="box-face left-side">
                <div className="image-container">
                    <FaUserCircle className="profile-icon" />
                </div>
            </div>
            <div className="box-face back">
                <div className="image-container">
                    <FaUserCircle className="profile-icon" />
                </div>
            </div>

            <div className="box-face bottom"></div>

            {/* Top flaps */}
            <div className="top-flap top-right"></div>
            <div className="top-flap top-left"></div>
            <div className="top-flap top-back"></div>
            <div className="top-flap top-front"></div>
        </div>
    );
};

export default GlowingBox;

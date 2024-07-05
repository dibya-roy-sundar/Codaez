import React, { useState } from 'react';
import './CompleteProfile.scss';
import { FaGoogle } from 'react-icons/fa';
import OTPVerification from './OtpVerification';

const CompleteProfile = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [profilePicture, setProfilePicture] = useState(null);
    const [otpOpen, setOtpOpen] = useState(false);

    const handleNextStep = () => {
        if (currentStep === 1) {
            setOtpOpen(true);
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const closeOtpModal = () => {
        setOtpOpen(false);
        setCurrentStep(2);
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="progress-bar">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                        <p>User Credentails</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                        <p>User Details</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                        <p>Coding Usenames</p>
                    </div>
                </div>
                <div className="register-form">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="register-step">
                                <h3>User Credentails</h3>
                                <div className="input-wrap">
                                    <input type="text" id="username" name="username" required />
                                    <label htmlFor="username">Username</label>
                                </div>
                                <div className="input-wrap">
                                    <input type="email" id="email" name="email" required />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="input-wrap">
                                    <input type="password" id="password" name="password" required />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <button type="button" className="register-button" onClick={handleNextStep}>
                                    Register
                                </button>
                                <div className="google-button">
                                    <div className="google-btn-image">
                                        <FaGoogle />
                                    </div>
                                    <div>
                                        <span>Register with Google</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="register-step">
                                <h3>User Details</h3>
                                <div className="profile-input">
                                    <div className="profile-picture">
                                        {profilePicture ? (
                                            <img src={profilePicture} alt="Profile" />
                                        ) : (
                                            <input type="file" id="photo" name="photo" accept="image/*" onChange={handleProfilePictureChange} />
                                        )}
                                    </div>
                                    <div className="name-fields">
                                        <div className="input-wrap">
                                            <input type="text" id="firstName" name="firstName" required />
                                            <label htmlFor="firstName">First Name</label>
                                        </div>
                                        <div className="input-wrap">
                                            <input type="text" id="lastName" name="lastName" required />
                                            <label htmlFor="lastName">Last Name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="college" name="college" required />
                                    <label htmlFor="college">College Name</label>
                                </div>
                                <div className="register-buttons">
                                    <button type="button" className="register-button" onClick={handleNextStep}>
                                        Next
                                    </button>
                                    <button type="button" className="register-button" onClick={handlePrevStep}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="register-step">
                                <h3>Coding Usernames</h3>
                                <div className="input-wrap">
                                    <input type="text" id="leetcode" name="leetcode" required />
                                    <label htmlFor="leetcode">LeetCode Username</label>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="codeforces" name="codeforces" required />
                                    <label htmlFor="codeforces">Codeforces Username</label>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="codechef" name="codechef" required />
                                    <label htmlFor="codechef">CodeChef Username</label>
                                </div>
                                <div className='register-buttons'>
                                    <button type="submit" className="register-button">
                                        Submit
                                    </button>
                                    <button type="button" className="register-button" onClick={handlePrevStep}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <OTPVerification isOpen={otpOpen} onClose={closeOtpModal} />
        </div>
    );
};

export default CompleteProfile;

import React, { useState } from 'react';
import './Register.scss';
import { FaGoogle } from 'react-icons/fa';

const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [profilePicture, setProfilePicture] = useState(null);

    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
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

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="progress-bar">
                    <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                </div>
                <div className="register-form">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="register-step">
                                <h3>Step 1: Username, Email, Password</h3>
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
                                <h3>Step 2: Photo, Name, College Name</h3>
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
                                <h3>Step 3: LeetCode, Codeforces, CodeChef Usernames</h3>
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
        </div>
    );
};

export default Register;

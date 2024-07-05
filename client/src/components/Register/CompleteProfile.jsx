import React, { useState } from 'react';
import './CompleteProfile.scss';
// import { FaGoogle } from 'react-icons/fa';
// import OTPVerification from './OtpVerification';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';

const CompleteProfile = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [profilePicture, setProfilePicture] = useState(null);
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        college: '',
        leetcode: '',
        codeforces: '',
        codechef: ''
    });
    // const [otpOpen, setOtpOpen] = useState(false);
    const user = useSelector(state => state.auth.auth);
    console.log('user', user);
    const handleNextStep = () => {
        // data saving code

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
    const handleStepChange = (step) => {
        setCurrentStep(step);
    }
    // const closeOtpModal = () => {
    //     setOtpOpen(false);
    //     setCurrentStep(2);
    // };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="progress-bar">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: 'pointer' }}>
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`} onClick={() => handleStepChange(1)}>
                            {currentStep > 1 ? <FaCheck /> : '1'}
                        </div>
                        <p>User Credentails</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: 'pointer' }}>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`} onClick={() => handleStepChange(2)}>
                            {currentStep > 2 ? <FaCheck /> : '2'}
                        </div>
                        <p>User Details</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: 'pointer' }}>
                        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`} onClick={() => handleStepChange(3)}>
                            {currentStep > 3 ? <FaCheck /> : '3'}
                        </div>
                        <p>Coding Usenames</p>
                    </div>
                </div>
                <div className="register-form">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="register-step">
                                <h3>User Credentails</h3>
                                <div className="input-wrap">
                                    <input type="text" id="username" name="username" value={user.username} readOnly required />

                                </div>
                                <div className="input-wrap">
                                    <input type="email" id="email" name="email" value={user.email} readOnly required />

                                </div>
                                {/* <div className="input-wrap">
                                    <input type="password" id="password" name="password" required />
                                    <label htmlFor="password">Password</label>
                                </div> */}
                                {/* <button type="button" className="register-button" onClick={handleNextStep}>
                                    Register
                                </button> */}
                                {/* <div className="google-button">
                                    <div className="google-btn-image">
                                        <FaGoogle />
                                    </div>
                                    <div>
                                        <span>Register with Google</span>
                                    </div>
                                </div> */}
                                <div className="register-buttons">
                                    <button type="button" className="register-button" onClick={handleNextStep}>
                                        Next
                                    </button>

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
                                            <input type="text" id="firstName" name="firstName" value={formValues.firstName} onChange={handleInputChange} required />
                                            <label htmlFor="firstName">First Name</label>
                                        </div>
                                        <div className="input-wrap">
                                            <input type="text" id="lastName" name="lastName" value={formValues.lastName} onChange={handleInputChange} required />
                                            <label htmlFor="lastName">Last Name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="college" name="college" value={formValues.college} onChange={handleInputChange} required />
                                    <label htmlFor="college">College Name</label>
                                </div>
                                <div className="register-buttons">

                                    <button type="button" className="register-button" onClick={handlePrevStep}>
                                        Back
                                    </button>
                                    <button type="button" className="register-button" onClick={handleNextStep}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="register-step">
                                <h3>Coding Usernames</h3>
                                <div className="input-wrap">
                                    <input type="text" id="leetcode" name="leetcode" value={formValues.leetcode} onChange={handleInputChange} required />
                                    <label htmlFor="leetcode">LeetCode Username</label>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="codeforces" name="codeforces" value={formValues.codeforces} onChange={handleInputChange} required />
                                    <label htmlFor="codeforces">Codeforces Username</label>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="codechef" name="codechef" value={formValues.codechef} onChange={handleInputChange} required />
                                    <label htmlFor="codechef">CodeChef Username</label>
                                </div>
                                <div className='register-buttons'>
                                    <button type="button" className="register-button" onClick={handlePrevStep}>
                                        Back
                                    </button>
                                    <button type="submit" className="register-button">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            {/* <OTPVerification isOpen={otpOpen} onClose={closeOtpModal} /> */}
        </div>
    );
};

export default CompleteProfile;

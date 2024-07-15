import React, { useState } from 'react';
import './CompleteProfile.scss';
// import { FaGoogle } from 'react-icons/fa';
// import OTPVerification from './OtpVerification';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import codeforces from '../../assets/codeforces.png';
import leetcode from '../../assets/leetcode.png';
import codechef from '../../assets/codechef.png';
import { setAuth } from '../../redux/authReducer';
import { useNavigate } from 'react-router-dom';
import usePutHook from '../../hooks/usePutHook';

const CompleteProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(2);
    const [profilePicture, setProfilePicture] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        college: '',
        leetcode: '',
        codeforces: '',
        codechef: ''
    });

    const user = useSelector(state => state.auth.auth);

    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = await usePutHook('/complete-profile', {
            name: formValues.firstName + " " + formValues.lastName,
            college: formValues.college,
            lc: formValues.leetcode,
            cf: formValues.codeforces,
            cc: formValues.codechef,
            avatar: avatar,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (data.data && data.data.user) {
            // toast.success(`Welcome back, ${data.data.user.name}`, {
            //     position: toast.POSITION.TOP_LEFT
            // });
            dispatch(setAuth(data.data.user));
            navigate('/dashboard');
        }
        else if (data.data) {
            // toast.warn(data.data.error || data.data.message, {
            //     position: toast.POSITION.TOP_LEFT
            // });
        }
        else {
            console.log(data);
            // toast.error(data.error, {
            //     position: toast.POSITION.TOP_LEFT
            // });
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
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
                    <div className='eachStep' onClick={() => handleStepChange(1)}>
                        <div className={`progress-step ${currentStep > 1 ? 'completed' : currentStep == 1 ? 'active' : ''}`}>
                            {currentStep > 1 ? <FaCheck /> : '1'}
                        </div>
                        <p>User Credentails</p>
                    </div>
                    <div className='eachStep' onClick={() => handleStepChange(2)}>
                        <div className={`progress-step ${currentStep > 2 ? 'completed' : currentStep == 2 ? 'active' : ''}`}>
                            {currentStep > 2 ? <FaCheck /> : '2'}
                        </div>
                        <p>User Details</p>
                    </div>
                    <div className='eachStep' onClick={() => handleStepChange(3)}>
                        <div className={`progress-step ${currentStep > 3 ? 'completed' : currentStep == 3 ? 'active' : ''}`}>
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
                                    <input type="text" id="username" name="username" value={user.username} disabled required />
                                </div>
                                <div className="input-wrap">
                                    <input type="email" id="email" name="email" value={user.email} disabled required />
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
                                            <img src={profilePicture} alt="profile image" />
                                        ) : (
                                            <input type="file" id="photo" name="photo" accept="image/*" onChange={handleProfilePictureChange} />
                                        )}
                                    </div>
                                    <div className="name-fields">
                                        <div className="input-wrap">
                                            <input type="text" id="firstName" name="firstName" value={formValues.firstName} placeholder='' onChange={handleInputChange} />
                                            <label htmlFor="firstName">First Name</label>
                                        </div>
                                        <div className="input-wrap">
                                            <input type="text" id="lastName" name="lastName" value={formValues.lastName} placeholder='' onChange={handleInputChange} />
                                            <label htmlFor="lastName">Last Name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="college" name="college" value={formValues.college} placeholder='' onChange={handleInputChange} />
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
                                <div className="codingLogoContainer">
                                    <div className='logo'>
                                        <img src={codeforces} alt="" />
                                    </div>
                                    <div className="input-wrap">
                                        <input type="text" id="codeforces" name="codeforces" value={formValues.codeforces} placeholder='' onChange={handleInputChange} />
                                        <label htmlFor="codeforces">Username</label>
                                    </div>
                                </div>
                                <div className="codingLogoContainer">
                                    <div className='logo'>
                                        <img src={leetcode} alt="" />
                                    </div>
                                    <div className="input-wrap">
                                        <input type="text" id="leetcode" name="leetcode" value={formValues.leetcode} placeholder='' onChange={handleInputChange} />
                                        <label htmlFor="leetcode">Username</label>
                                    </div>
                                </div>
                                <div className="codingLogoContainer">
                                    <div className='logo'>
                                        <img src={codechef} alt="" />
                                    </div>
                                    <div className="input-wrap">
                                        <input type="text" id="codechef" name="codechef" value={formValues.codechef} placeholder='' onChange={handleInputChange} />
                                        <label htmlFor="codechef">Username</label>
                                    </div>
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
        </div>
    );
};

export default CompleteProfile;

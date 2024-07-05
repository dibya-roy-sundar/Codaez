import { FaGoogle } from 'react-icons/fa';
import OTPVerification from './OtpVerification';
import { useState } from 'react';
import './Register.scss'
const Register = () => {

    const [otpOpen, setOtpOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };
    const closeOtpModal = () => {
        setOtpOpen(false);

    };
    const handleNextStep = () => {
        setOtpOpen(true);
    }
    return (
        <div className="completeprofile-container">
            <div className="register-content">
                <div className="register-form">
                    <form onSubmit={handleSubmit}>
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
                    </form>
                </div>
            </div>
            <OTPVerification isOpen={otpOpen} onClose={closeOtpModal} />
        </div>

    )
}
export default Register;
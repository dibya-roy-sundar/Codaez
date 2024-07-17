import { FaGoogle } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import OTPVerification from './OtpVerification';
import { useState } from 'react';
import './Register.scss'
const Register = ({ registerUserCredentials, handleRegisterChange, handleRegisterSubmit }) => {

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    // const [otpOpen, setOtpOpen] = useState(false);

    // const closeOtpModal = () => {
    //     setOtpOpen(false);
    // };



    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => { handleRegisterSubmit(e) }}>
                <h2>Register</h2>
                <div className="input-wrap">
                    <input type="text" id='reg-username' name='username' value={registerUserCredentials.username} placeholder='' onChange={(e) => handleRegisterChange(e)} />
                    <label htmlFor="reg-username">Username</label>
                </div>
                <div className="input-wrap">
                    <input type="email" id="reg-email" name='email' value={registerUserCredentials.email} placeholder='' onChange={(e) => handleRegisterChange(e)} />
                    <label htmlFor="reg-email">Email</label>
                </div>
                <div className="input-wrap">
                    <input type={passwordVisible ? "text" : "password"} id="reg-password" name='password' placeholder='' value={registerUserCredentials.password} onChange={(e) => handleRegisterChange(e)} />
                    <label htmlFor="reg-password">Password</label>
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button className="login-button">Register</button>
                <div className="google-button">

                    <div className='google-btn-image'>
                        <FaGoogle />
                    </div>
                    <div>
                        <span>Register with Google</span>
                    </div>
                </div>
            </form>
            
             <OTPVerification isOpen={otpOpen} onClose={closeOtpModal} />
        </div>
    )
}
export default Register;
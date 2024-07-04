import { useState } from 'react';
import { FaGoogle } from "react-icons/fa";

import './Login.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const Login = ({ loginUserCredentials, handleLoginChange, handleLoginSubmit }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => handleLoginSubmit(e)}>
                <h2>Login</h2>
                <div className="input-wrap">
                    <input type="text" id='username' name='username' value={loginUserCredentials.username} onChange={(e) => handleLoginChange(e)} required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="input-wrap">
                    <input type="email" id="email" name='email' value={loginUserCredentials.email} onChange={(e) => handleLoginChange(e)} required />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="input-wrap">
                    <input type={passwordVisible ? "text" : "password"} id="password" name='password' value={loginUserCredentials.password} onChange={(e) => handleLoginChange(e)} required />
                    <label htmlFor="password">Password</label>
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button className="login-button">Login</button>
            </form>
            {/* <button className="google-login">
                <div className="google-icon-circle">
                    <FaGoogle />
                </div>
            </button> */}
        </div>
    );
};

export default Login;

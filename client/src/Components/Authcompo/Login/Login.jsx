import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.scss';

const LoginForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (


        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <div className="input-wrap">
                    <input type="text" id="username" required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="input-wrap">
                    <input type="email" id="email" required />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="input-wrap">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                    </span>
                </div>
                <button className="login-button">Login</button>
                <button className="google-login">
                    <div className="google-icon-circle">
                        <FontAwesomeIcon icon={faGoogle} />
                    </div>

                </button>
            </div>
        </div>

    );
};

export default LoginForm;

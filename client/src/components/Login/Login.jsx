/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import './Login.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import usePostFetch from '../../hooks/usePostFetch';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authReducer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { motion } from 'framer-motion';
import google from '../../assets/google.png'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const [loginUserCredentials, setLoginUserCredentials] = useState({
        userDetails: "",
        password: "",
    });

    const handleLoginChange = (e) => {
        setLoginUserCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const [isLoginprocess, setisLoginprocess] = useState(false);
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        console.log(1)
        if (isLoginprocess) return;
        try {
            setisLoginprocess(true);
            console.log(2)
            const data = await usePostFetch('/login', loginUserCredentials);
            console.log(3)

            if (data.data && data.data.user) {
                console.log(4)
                toast.success(`Welcome back, ${data.data.user.name}`, {
                    position: "top-right"
                });
                dispatch(setAuth(data.data.user));
                navigate('/dashboard');
            } else if (data.data) {
                console.log(5)
                toast.warn(data.data.error || data.data.message, {
                    position: "top-right"
                });
            } else {
                console.log(6)
                toast.error(data.error, {
                    position: "top-right"
                });
            }
        } catch (error) {
            console.log(7)
            toast.error(error.message || "something went wrong!", {
                position: "top-right"
            });
        } finally {
            setisLoginprocess(false);
        }
    }


    const googleAuth = () => {
        window.open(`${import.meta.env.API_URL}auth/google`,
            '_self'
        )
    }

    return (
        <motion.div className="login-container"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <form className="login-form" onSubmit={(e) => handleLoginSubmit(e)}>
                <h2>Login</h2>
                <div className="input-wrap">
                    <input type="text" id="userDetails" name='userDetails' value={loginUserCredentials.userDetails} placeholder='' onChange={(e) => handleLoginChange(e)} />
                    <label htmlFor="userDetails">Username or Email </label>
                </div>
                <div className="input-wrap">
                    <input type={passwordVisible ? "text" : "password"} id="password" name='password' value={loginUserCredentials.password} placeholder='' onChange={(e) => handleLoginChange(e)} />
                    <label htmlFor="password">Password</label>
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button className="login-button">{isLoginprocess
                    ? <ClipLoader
                        color="#ffffff"
                        className="icon"
                        size={16}
                        speedMultiplier={1}
                    />
                    : "Login"}</button>
                <div className="google-button">
                        <span>OR</span>
                    <div className='google-btn-image' onClick={googleAuth}>
                        <img src={google} alt="" />
                    </div>
                </div>
            </form>


        </motion.div>
    );
};

export default Login;

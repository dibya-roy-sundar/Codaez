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

    const [isLoginprocess,setisLoginprocess]=useState(false);
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if(isLoginprocess) return ;
       try {
        setisLoginprocess(true);
         const data = await usePostFetch('/login', loginUserCredentials);
 
         if (data.data && data.data.user) {
             toast.success(`Welcome back, ${data.data.user.name}`, {
                 position: "top-right"
             });
             dispatch(setAuth(data.data.user));
             navigate('/dashboard');
         } else if (data.data) {
             toast.warn(data.data.error || data.data.message, {
                 position: "top-right"
             });
         } else {
             toast.error(data.error, {
                 position: "top-right"
             });
         }
       } catch (error) {
        toast.error(error.message || "something went wrong!", {
            position: "top-right"
        });
       }finally{
        setisLoginprocess(false);
       }
    }


    const googleAuth=()=>{
        window.open("http://localhost:3000/api/v1/auth/google",
            '_self'
        )
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => handleLoginSubmit(e)}>
                <h2>Login</h2>
                <div className="input-wrap">
                    <input type="text" id="userDetails" name='userDetails' value={loginUserCredentials.userDetails} placeholder='' onChange={(e) => handleLoginChange(e)} />
                    <label htmlFor="userDetails">Email or Username </label>
                </div>
                <div className="input-wrap">
                    <input type={passwordVisible ? "text" : "password"} id="password" name='password' value={loginUserCredentials.password} placeholder='' onChange={(e) => handleLoginChange(e)} />
                    <label htmlFor="password">Password</label>
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button className="login-button">{isLoginprocess ? "Loading..." : "Login"}</button>
                <div className="google-button">

                    <div className='google-btn-image' onClick={googleAuth}>
                        <FaGoogle />
                    </div>
                    <div>
                        <span>Login with Google</span>
                    </div>
                </div>
            </form>


        </div>
    );
};

export default Login;

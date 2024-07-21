import { FaGoogle } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import OTPVerification from './OtpVerification';
import { useState } from 'react';
import './Register.scss'
import { toast } from 'react-toastify';
import usePostFetch from '../../hooks/usePostFetch';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import google from '../../assets/google.png'


const Register = () => {


    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const [otpOpen, setOtpOpen] = useState(false);



    const googleAuth = () => {
        window.open("http://localhost:3000/api/v1/auth/google",
            '_self'
        )
    }

    const [registerUserCredentials, setRegisterUserCredentials] = useState({
        email: "",
        password: "",
    });

    const handleRegisterChange = (e) => {
        setRegisterUserCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const [issendotpProcess, setisOtpProcess] = useState(false);
    const handleOtpSent = async (e) => {
        e.preventDefault();
        if (issendotpProcess) return;

        try {
            setisOtpProcess(true);
            const data = await usePostFetch('/send-otp', { email: registerUserCredentials.email });

            if (data && data.data) {
                if (!data.data.success) {
                    toast.warn(data.data.message, {
                        position: "top-right"
                    });
                } else {
                    setOtpOpen(true);
                    toast.success(data.data.message, {
                        position: "top-right"
                    });
                }
            }
        } catch (error) {
            toast.warn(error.message || "something went wrong!!!", {
                position: "top-right"
            });
        } finally {
            setisOtpProcess(false);
        }


    }



    return (
        <motion.div className="login-container"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <form className="login-form" onSubmit={(e) => { handleOtpSent(e) }}>
                <h2>Register</h2>
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
                <button disabled={issendotpProcess} className="login-button">{issendotpProcess ? <>
                    <ClipLoader
                        color="#ffffff"
                        className="icon"
                        size={16}
                        speedMultiplier={1}
                    />
                </>
                    : "Register"}</button>
                <div className="google-button">
                    <span>OR</span>
                    <div className='google-btn-image' onClick={googleAuth}>
                        <img src={google} alt="" />
                    </div>
                </div>
            </form>

            {otpOpen && <OTPVerification email={registerUserCredentials.email} password={registerUserCredentials.password} resend={handleOtpSent} isOpen={otpOpen} onClose={setOtpOpen} />}
        </motion.div>
    )
}
export default Register;
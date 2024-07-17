import React, { useEffect, useRef } from 'react';
import './OTPVerification.scss';
import { FaTimes } from 'react-icons/fa';
import usePostFetch from '../../hooks/usePostFetch';
import { toast } from 'react-toastify';
import { setAuth } from '../../redux/authReducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const OTPVerification = ({ resend,isOpen, onClose,email,password }) => {
    const inputsRef = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            const inputs = inputsRef.current;
            if (inputs[0]) {
                inputs[0].focus();
            }

            const handleKeyDown = (e) => {
                if (
                    !/^[0-9]{1}$/.test(e.key) &&
                    e.key !== 'Backspace' &&
                    e.key !== 'Delete' &&
                    e.key !== 'Tab' &&
                    !e.metaKey
                ) {
                    e.preventDefault();
                }

                if (e.key === 'Delete' || e.key === 'Backspace') {
                    const index = inputs.indexOf(e.target);
                    if (index > 0) {
                        inputs[index - 1].value = '';
                        inputs[index - 1].focus();
                    }
                }
            };

            const handleInput = (e) => {
                const { target } = e;
                const index = inputs.indexOf(target);
                if (target.value) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        inputs[inputs.length - 1].blur();
                    }
                }
            };

            const handleFocus = (e) => {
                e.target.select();
            };

            const handlePaste = (e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text');
                if (!new RegExp(`^[0-9]{${inputs.length}}$`).test(text)) {
                    return;
                }
                const digits = text.split('');
                inputs.forEach((input, index) => input.value = digits[index]);
                inputs[inputs.length - 1].blur();
            };

            inputs.forEach((input) => {
                if (input) {
                    input.addEventListener('input', handleInput);
                    input.addEventListener('keydown', handleKeyDown);
                    input.addEventListener('focus', handleFocus);
                    input.addEventListener('paste', handlePaste);
                }
            });

            return () => {
                inputs.forEach((input) => {
                    if (input) {
                        input.removeEventListener('input', handleInput);
                        input.removeEventListener('keydown', handleKeyDown);
                        input.removeEventListener('focus', handleFocus);
                        input.removeEventListener('paste', handlePaste);
                    }
                });
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const verifyOtp=async (e)=>{
        e.preventDefault();
        let otp="";
        inputsRef.current.forEach((item) => otp+=item.value);
    
        const data=await usePostFetch('/register',{email,password,otp});
        if (data.data && data.data.user) {
                toast.success(`Email verification successful!`, {
                    position: "top-right"
                });
                dispatch(setAuth(data.data.user));
                navigate('/completeprofile');
            } else if (data.data) {
                toast.warn(data.data.error || data.data.message, {
                    position: "top-right"
                });
            } else {
                toast.error(data.error, {
                    position: "top-right"
                });
            }

        
    }

    const resendCode=(e)=>{
        inputsRef.current.forEach((item) =>item.value=null);
        inputsRef.current.length=0;
        resend(e);
    }

    return (
        <div className="otp-verification">
            <div className="otp-container">
                <button className="close-button" onClick={()=>{onClose(false)}}>
                    <FaTimes />
                </button>
                <header className="otp-header">
                    <h1>Email Verification</h1>
                    <p>Enter the 4-digit verification code that was sent to your email</p>
                </header>
                <form id="otp-form">
                    <div className="otp-inputs">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                ref={(el) => (inputsRef.current[index] = el)}
                                maxLength="1"
                                className="otp-input"
                            />
                        ))}
                    </div>
                    <button   className={`${inputsRef.current.length===4 ? ""  : " " } verify-button`} onClick={(e)=> verifyOtp(e)}>
                        Verify Account
                    </button>
                </form>
                <div className="resend-text">
                    <p>
                        {"Didn't receive code?"} <a href="#0" onClick={(e) => resendCode(e)}>Resend</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;

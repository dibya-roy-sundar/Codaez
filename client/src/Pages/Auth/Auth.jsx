import { useState } from 'react';
import './Auth.scss';
import usePostFetch from '../../hooks/usePostFetch';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authReducer';
import { useNavigate } from 'react-router-dom';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';
import { toast } from 'react-toastify';

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoginMode, setIsLoginMode] = useState(true);
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

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
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
            console.log(data);
            toast.error(data.error, {
                position: "top-right"
            });
        }
    }

    const [registerUserCredentials, setRegisterUserCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleRegisterChange = (e) => {
        setRegisterUserCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const data = await usePostFetch('/register', registerUserCredentials);

        if (data.data && data.data.user) {
            toast.success(`Greetings, ${data.data.user.name}`, {
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

    const toggleMode = () => {
        setIsLoginMode(prevMode => !prevMode);
    }

    return (
        <div className="auth">
            {/* Toggle Button */}
            <div className="toggle-container">
                <input type="checkbox" id="reg-log" name="reg-log" className="checkbox" onChange={toggleMode} />
                <label htmlFor="reg-log"></label>
            </div>
            {/* Login or Register Component based on toggle state */}
            {isLoginMode ? (
                <Login
                    loginUserCredentials={loginUserCredentials}
                    handleLoginChange={handleLoginChange}
                    handleLoginSubmit={handleLoginSubmit}
                />
            ) : (
                <Register
                    registerUserCredentials={registerUserCredentials}
                    handleRegisterChange={handleRegisterChange}
                    handleRegisterSubmit={handleRegisterSubmit}
                />
            )}
        </div>
    )
}

export default Auth;

import { useState } from 'react';
import './Auth.scss';
import usePostFetch from '../../hooks/usePostFetch';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authReducer';
import { useNavigate } from 'react-router-dom';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginUserCredentials, setLoginUserCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleLoginChange = (e) => {
        setLoginUserCredentials(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const data = await usePostFetch('/login', loginUserCredentials);

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
    }

    const [registerUserCredentials, setRegisterUserCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleRegisterChange = (e) => {
        setRegisterUserCredentials(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value
            }
        ));
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const data = await usePostFetch('/register',registerUserCredentials);
        // console.log(data.data);

        if (data.data && data.data.user) {
            // toast.success(`Hello ${data.data.user.name}`, {
            //     position: toast.POSITION.TOP_LEFT
            // });
            dispatch(setAuth(data.data.user));
            navigate('/completeprofile');
        }
        else if (data.data) {
            // toast.warn(data.data.error || data.data.message, {
            //     position: toast.POSITION.TOP_LEFT
            // });
        }
        else {
            // toast.error(data.error, {
            //     position: toast.POSITION.TOP_LEFT
            // });
        }
    }

    return (
        <div className="auth">
            <Login loginUserCredentials={loginUserCredentials} handleLoginChange={handleLoginChange} handleLoginSubmit={handleLoginSubmit} />
            <Register registerUserCredentials={registerUserCredentials} handleRegisterChange={handleRegisterChange} handleRegisterSubmit={handleRegisterSubmit} />
        </div>
    )
}

export default Auth;
import { useState } from 'react';
import './Auth.scss';
import usePostFetch from '../../hooks/usePostFetch';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authReducer';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userCredentials, setUserCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUserCredentials(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await usePostFetch('/login', userCredentials);

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

    return (
        <div className="auth">
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" name='username' value={userCredentials.username} onChange={(e) => handleChange(e)} />
                <input type="email" name='email' value={userCredentials.email} onChange={(e) => handleChange(e)} />
                <input type="password" name='password' value={userCredentials.password} onChange={(e) => handleChange(e)} />
                <button>Login</button>
            </form>
        </div>
    )
}

export default Auth;
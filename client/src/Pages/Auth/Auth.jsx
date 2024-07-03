import { useState } from 'react';
import './Auth.scss';
import usePostFetch from '../../hooks/usePostFetch';

const Auth = () => {
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

    const handleSubmit = async() => {
        const data = await usePostFetch('/login', userCredentials);
        console.log(data);
    }

    return (
        <div className="auth">
            <input type="text" name='username' value={userCredentials.username} onChange={(e) => handleChange(e)} />
            <input type="email" name='email' value={userCredentials.email} onChange={(e) => handleChange(e)} />
            <input type="password" name='password' value={userCredentials.password} onChange={(e) => handleChange(e)} />
            <button onClick={handleSubmit}>Login</button>
        </div>
    )
}

export default Auth;
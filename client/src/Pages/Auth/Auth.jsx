import { useEffect, useState } from 'react';
import './Auth.scss';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';
import { useLocation } from 'react-router-dom';
import {toast} from "react-toastify"

const Auth = () => {
    const location=useLocation();
    
    

    useEffect(()=>{
        const state=location.state ;
       
        if ( state &&  Object.keys(state).length>0 && state.showToastify ) {
            toast.error("You must be logged in first", {
              position: "top-right",
            });
            state.showToastify=false;
          }
          
    },[location])
  

    const [isLoginMode, setIsLoginMode] = useState(true);
    

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
                <Login />
            ) : (
                <Register />
            )}
        </div>
    )
}

export default Auth;

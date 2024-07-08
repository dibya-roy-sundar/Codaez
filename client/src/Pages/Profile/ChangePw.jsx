import { forwardRef, useEffect, useState } from "react"
import "./ChangePw.scss"
import Modal from "./Modal"
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import usePutHook from "../../hooks/usePutHook"

// eslint-disable-next-line react/display-name, react/prop-types
const ChangePw = forwardRef(({ handleClose,changePwRef }) => {
    const [passwords, setPasswords] = useState({
        old: '',
        new: '',
        renew: '',
    });
    const [pwError,setpwError]=useState('');

    const handleChange = (e) => {
        setPasswords(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value
            }
        ));
    };

    const [passwordVisible, setPasswordVisible] = useState({
        old: false,
        new: false,
        renew: false,
    });

    const togglePasswordVisibility = (field) => {
        setPasswordVisible(prev => (
            {
                ...prev,
                [field]: !prev[field]
            }
        ));
    };


    
    const removeData=()=>{
        setpwError(null);
        setPasswords({
                old: '',
                new: '',
                renew: '',
        })
        setPasswordVisible({
            old: false,
            new: false,
            renew: false,
        })
    }

    const handleSubmit=async (e) =>{
        e.preventDefault();
        if(passwords.new!==passwords.renew){
            setpwError('both passwords must match');
        }else{
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const {data,error} = await usePutHook('/changepw', {oldpw:passwords.old, newpw:passwords.new});

            if(error){
                setpwError(error);
            } else if(data){
                // console.log(data.message);  toastify
                removeData();
                handleClose();
            }
        }

    }


    return (
        <Modal ref={changePwRef}>
            <div className="changepwcontainer">
                <p>Change Password</p>
                <form onSubmit={handleSubmit}>
                    <div className="inputfields">
                        <div className="input-wrap">
                            <input type={passwordVisible.old ? "text" : "password"} id="old" name='old' value={passwords.old} onChange={(e) => handleChange(e)} required />
                            <label htmlFor="old">Old Password</label>
                            <span className="toggle-password" onClick={()=>togglePasswordVisibility('old')}>
                                {passwordVisible.old ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <div className="input-wrap">
                            <input type={passwordVisible.new ? "text" : "password"} id="new" name='new' value={passwords.new} onChange={(e) => handleChange(e)} required />
                            <label htmlFor="new">New Password</label>
                            <span className="toggle-password" onClick={()=>togglePasswordVisibility('new')}>
                                {passwordVisible.new ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <div className="input-wrap">
                            <input type={passwordVisible.renew ? "text" : "password"} id="renew" name='renew' value={passwords.renew} onChange={(e) => handleChange(e)} required />
                            <label htmlFor="renew">Re-enter New Password</label>
                            <span className="toggle-password" onClick={()=>togglePasswordVisibility('renew')}>
                                {passwordVisible.renew ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    {pwError?.length>0 &&  
                        <div>
                           <p>{pwError}</p>
                        </div>}
                    <div className="btn">
                        <div className="closeform">
                            <form method="dialog">
                                <button  onClick={removeData} >Cancel</button>
                            </form>
                        </div>
                        <button type="submit">Save</button>
                    </div>

                </form>

            </div>
        </Modal>
    )
})

export default ChangePw
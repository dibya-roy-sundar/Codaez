import { forwardRef, useEffect, useState } from "react"
import "./ChangePw.scss"
import Modal from "./Modal"
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import usePutHook from "../../hooks/usePutHook"
import { toast } from "react-toastify"

// eslint-disable-next-line react/display-name, react/prop-types
const ChangePw = forwardRef(({ setReload, handleClose, changePwRef, user }) => {
    const [passwords, setPasswords] = useState({
        old: '',
        new: '',
        renew: '',
    });

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



    const removeData = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.renew) {
            toast.warn("Both Passwords must match", {
                position: "top-right"
            });
        } else {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const data = await usePutHook('/changepw', { oldpw: passwords.old, newpw: passwords.new });
            console.log(data);

            if (data.data) {
                removeData();
                handleClose();
                toast.success(`Password Changed!`, {
                    position: "top-right"
                });
                setReload(prev => prev+1);
            }
            else if (data.error) {
                toast.error(data.error, {
                    position: "top-right"
                });
            }
            else {
                console.log(data);
                toast.error(data.error, {
                    position: "top-right"
                });
            }
        }

    }


    return (
        <Modal ref={changePwRef}>
            <div className="changepwcontainer">
                <p>{user.password ? "Change" : "Set"} Password</p>
                <form onSubmit={handleSubmit}>
                    <div className="inputfields">
                        {user.password ?
                            <div className="input-wrap">
                                <input type={passwordVisible.old ? "text" : "password"} id="old" name='old' value={passwords.old} onChange={(e) => handleChange(e)} />
                                <label htmlFor="old">Old Password</label>
                                <span className="toggle-password" onClick={() => togglePasswordVisibility('old')}>
                                    {passwordVisible.old ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            : ""
                        }
                        <div className="input-wrap">
                            <input type={passwordVisible.new ? "text" : "password"} id="new" name='new' value={passwords.new} onChange={(e) => handleChange(e)} />
                            <label htmlFor="new">New Password</label>
                            <span className="toggle-password" onClick={() => togglePasswordVisibility('new')}>
                                {passwordVisible.new ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <div className="input-wrap">
                            <input type={passwordVisible.renew ? "text" : "password"} id="renew" name='renew' value={passwords.renew} onChange={(e) => handleChange(e)} />
                            <label htmlFor="renew">Re-enter New Password</label>
                            <span className="toggle-password" onClick={() => togglePasswordVisibility('renew')}>
                                {passwordVisible.renew ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="btn">
                        <div className="closeform">
                            <form method="dialog">
                                <button onClick={removeData} >Cancel</button>
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
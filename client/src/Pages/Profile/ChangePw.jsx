import { forwardRef, useState } from "react"
import "./ChangePw.scss"
import Modal from "./Modal"
import Labelinput from "./Labelinput"
import { FaEye, FaEyeSlash } from "react-icons/fa6"

// eslint-disable-next-line react/display-name, react/prop-types
const ChangePw = forwardRef(({ changePwRef }) => {
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

    return (
        <Modal ref={changePwRef}>
            <div className="changepwcontainer">
                <p>Change Password</p>
                <form>
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
                                {passwordVisible.old ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="btn">
                        <div className="closeform">
                            <form method="dialog">
                                <button>Cancel</button>
                            </form>
                        </div>
                        <button>Save</button>
                    </div>

                </form>

            </div>
        </Modal>
    )
})

export default ChangePw
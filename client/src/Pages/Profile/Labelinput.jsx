/* eslint-disable react/prop-types */
import { useState } from "react"
import "./Labelinput.scss"
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

// eslint-disable-next-line react/prop-types
const Labelinput = ({ name, label, value, edit, password, icon, image, type, onChange, ...props }) => {
    const [showpw, setShowpw] = useState(false)

    return (
        <>
            <div className="container">
                <label htmlFor={name} className="icon">
                    {icon}
                    {image && <img src={image} alt=" platform icon" />}
                    {label ? label : name}
                </label>
                {(edit && !props?.disabled) ? <input {...props} type={password ? (showpw ? "text" : "password") : (type ? type : "text")} name={name} id={name} value={value} onChange={(e) => {
                    onChange(name, e.target.value);
                }} style={password ? { paddingRight: '3.2rem' } : {}} /> : <p>{value?.length > 0 ? value : "- - -"}</p>}
                {edit && password && (showpw ? <FaEyeSlash onClick={() => { setShowpw((prev) => !prev) }} className="eye" /> : <FaEye onClick={() => { setShowpw((prev) => !prev) }} className="eye" />)}
            </div>
        </>
    )
}

export default Labelinput
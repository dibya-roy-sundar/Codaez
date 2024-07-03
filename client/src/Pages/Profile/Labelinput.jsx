import { useState } from "react"
import "./Labelinput.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

// eslint-disable-next-line react/prop-types
const Labelinput = ({name,value,edit,password,icon,image,type,...props}) => {
    const [inputValue,setValue]=useState(value)
    const [showpw,setShowpw]=useState(false)
   

  return (
    <>
        <div className="container">
            <div className="icon">
                {icon && icon}
                {image && <img src={image}  alt=" platform icon" />}
                
             <label htmlFor={name}>{name}</label>
            </div>
            {edit ?<input {...props} type={password ? (showpw?"text":"password") : (type?type:"text")} name={name} id={name} value={inputValue} onChange={(e)=>{
                setValue(e.target.value)
            }}  />: <p>{inputValue}</p>}
           {edit && password && <FontAwesomeIcon onClick={()=>{setShowpw((prev)=>!prev)}} className="eye" icon={showpw?faEye:faEyeSlash} />}
            
        </div>
    </>
  )
}

export default Labelinput
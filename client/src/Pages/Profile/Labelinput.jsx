/* eslint-disable react/prop-types */
import {  useState } from "react"
import "./Labelinput.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

// eslint-disable-next-line react/prop-types
const Labelinput = ({name,label,value,edit,password,icon,image,type,onChange,...props}) => {
  const [showpw,setShowpw]=useState(false)
 
   

  return (
    <>
        <div className="container">
            <div className="icon">
                {icon && icon}
                {image && <img src={image}  alt=" platform icon" />}
                
             <label htmlFor={name}>{label? label : name}</label>
            </div>
            {(edit && !props?.disabled ) ?<input {...props} type={password ? (showpw?"text":"password") : (type?type:"text")} name={name} id={name} value={value} onChange={(e)=>{
                onChange(name,e.target.value);
            }}  />: <p>{value?.length>0 ? value :"- - -"}</p>}
           {edit && password && <FontAwesomeIcon onClick={()=>{setShowpw((prev)=>!prev)}} className="eye" icon={showpw?faEye:faEyeSlash} />}
            
        </div>
    </>
  )
}

export default Labelinput
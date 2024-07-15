import React from 'react'
import './Footer.scss'
import { FaGithub } from "react-icons/fa";
const Footer = () => {
    return (
        <div className='footer'>
            <div>CODEHUB</div>
            <div>@copyright all rights are reseved</div>
            <div className='logo'><FaGithub /></div>
        </div>
    )
}

export default Footer;
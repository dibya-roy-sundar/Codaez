import React from 'react';
import './Footer.scss';
import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer-brand'>CODEHUB</div>
            <div className='footer-copyrights'>
                <div className='footer-copy'>&copy; All rights reserved.</div>
                <div className='footer-logo'>
                    <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
                        <FaGithub />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Footer;

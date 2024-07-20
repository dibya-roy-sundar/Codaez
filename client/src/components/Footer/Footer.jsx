import './Footer.scss';
import codaez from '../../assets/codaez.png';

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer-brand'>
                <img src={codaez} alt="" />
                <span>Cod<span className="purple">a</span>e<span className="purple">z</span></span>
            </div>
            <div className='footer-copyrights'>
                &copy;2024 All rights reserved
            </div>
        </div>
    );
}

export default Footer;


import React, { useEffect, useState } from 'react';
import './ScrollDown.scss';
const ScrollDown = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollDownOpacity = 1 - Math.min(scrollPosition * 0.02, 1);

    const scrollDownStyle = {
        transform: `translateY(-${scrollPosition * 1.5}px)`,
        opacity: scrollDownOpacity,
        transition: 'transform 0.1s ease-out, opacity 0.3s ease-out',
    };

    return (
        <div className="scroll-down-container" style={{ ...scrollDownStyle, bottom: '10px' }}>
            <div className="wrapper">
                <div className="box">
                    <div className="circle"></div>
                </div>
                <div className='scroll'>Scroll Down</div>
            </div>
        </div>
    );
};

export default ScrollDown;
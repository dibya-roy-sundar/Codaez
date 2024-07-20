import React, { useEffect, useRef } from "react";
import "./Loader.scss";
import { PuffLoader } from "react-spinners";
import { Triangle } from "react-loader-spinner"
import codaez from "../../assets/codaez.png";
import { motion } from 'framer-motion';

const Loader = () => {
    const divRef = useRef();

    useEffect(() => {
        const polygon = divRef.current.querySelector('polygon')

        if (polygon) {
            polygon.setAttribute('points', "11,0 22,0 33,11 33,22 22,33 11,33 0,22 0,11")
            polygon.setAttribute('stroke-width', "0.25")
        }
    }, [])
    return (
        <div className="loader">
            {/* <PuffLoader size={"20rem"} className="animation" color="black" /> */}
            <div className="reactLoader" ref={divRef}>
                <Triangle
                    visible={true}
                    height="300"
                    width="300"
                    color="#fff"
                    ariaLabel="triangle-loading"
                    stroke-width="0.5"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
            {/* <polygon fill="transparent" stroke="#000" stroke-width="0.25" points="11,0 22,0 32,11 32,22 22,32 11,32 0,22 0,11" class="sc-dsLQwm RQmlr"></polygon> */}
            <div className="animation">
                <img src={codaez} alt="codaez" className="logo" />
                <div className="brandName">
                    {['C', 'o', 'd', 'a', 'e', 'z'].map((letter, index) => (
                        <motion.span key={index}
                            initial={{ y: 0 }}
                            animate={{
                                y: [0, -10, 0], // Up and down motion
                                transition: {
                                    duration: 0.5,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                    delay: index * 0.1,
                                    staggerChildren: index * 0.1
                                }
                            }} >
                            {letter === 'a' || letter === 'z' ? (
                                <span className="purple">{letter}</span>
                            ) : (
                                letter
                            )}
                        </motion.span>
                    ))}
                </div>
            </div>
        </div >
    )
};

export default Loader;
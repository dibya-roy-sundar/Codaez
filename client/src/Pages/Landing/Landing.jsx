import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

import './Landing.scss';
import Footer from '../../components/Footer/Footer';
import GlowingBox from '../../components/landingpage/Box';

const Landing = () => {
    const features = [
        { id: 1, icon: '/path-to-your-icon1.png', text: 'Find Your Dream Home' },
        { id: 2, icon: '/path-to-your-icon2.png', text: 'Wide Range of Properties' },
        { id: 3, icon: '/path-to-your-icon3.png', text: 'Trusted by Thousands' },
        { id: 4, icon: '/path-to-your-icon4.png', text: 'Expert Advice' },
    ];
    const faqs = [
        { question: 'What is Estatein?', answer: 'Estatein is a platform for finding your dream property.' },
        { question: 'How can I contact support?', answer: 'You can contact support via our contact us page.' },
        { question: 'What services do you offer?', answer: 'We offer a wide range of property services.' },
        { question: 'How do I list my property?', answer: 'You can list your property by signing up and following the listing process.' }
    ];

    const FAQ = ({ faqs }) => {
        const [openIndex, setOpenIndex] = useState(null);
        const answerRefs = useRef([]);

        // useEffect(() => {
        //     answerRefs.current.forEach((ref, index) => {
        //         if (ref && openIndex === index) {
        //             ref.style.maxHeight = `${ref.scrollHeight}px`;
        //             ref.classList.add("show");
        //         } else if (ref) {
        //             ref.style.maxHeight = "0px";
        //             ref.classList.remove("show");
        //         }
        //     });
        // }, [openIndex]);

        const toggleFAQ = (index) => {
            setOpenIndex(openIndex === index ? null : index);
        };

        return (
            <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                {faqs && faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div className="faq-question" onClick={() => toggleFAQ(index)}>
                            <h4>{faq.question}</h4>
                            {openIndex === index ? <FaMinus className="faq-icon" /> : <FaPlus className="faq-icon" />}
                        </div>
                        <div
                            className={`faq-answer ${openIndex === index ? 'show' : ''}`}
                        // ref={(el) => (answerRefs.current[index] = el)}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="landing">
            <header className="header">
                <div className="logo">Estatein</div>
                <nav className="nav">
                    <a href="#">Home</a>
                    <a href="#">About Us</a>
                    <a href="#">Properties</a>
                    <a href="#">Services</a>
                    <a href="#">Contact Us</a>
                </nav>
                <div><button>LOGIN</button></div>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <div className="content">
                        <h1>Discover Your Dream Property with Estatein</h1>
                        <p>Your journey to finding the perfect property begins here. Explore our listings to find the home that matches your dreams.</p>
                        <div className="buttons">
                            <button className="btn learn-more">Learn More</button>
                            <button className="btn browse-properties">Browse Properties</button>
                        </div>
                    </div>

                    <section className="stats">
                        <div className="stat">
                            <h3>200+</h3>
                            <p>Happy Customers</p>
                        </div>
                        <div className="stat">
                            <h3>10k+</h3>
                            <p>Properties For Clients</p>
                        </div>
                        <div className="stat">
                            <h3>16+</h3>
                            <p>Years of Experience</p>
                        </div>
                    </section>

                </div>
                <div className="image">
                    <GlowingBox />
                </div>
            </section>
            <section className="features">
                {features.map(feature => (
                    <div key={feature.id} className="feature">
                        <img src={feature.icon} alt='' />
                        <p>{feature.text}</p>
                    </div>
                ))}
            </section>
            <section className='project-images'>
                <div>
                    <h1>Highlights</h1>

                </div>
            </section>

            <FAQ faqs={faqs} />

            <Footer />
        </div>
    );
}

export default Landing;

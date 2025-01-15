import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeAuth } from '../../redux/authReducer';
import { makeRequest } from '../../hooks/makeRequest';
import ImageCard from './ImageCarousel';
import Footer from '../../components/Footer/Footer';
import './Landing.scss';
import { motion } from 'framer-motion';

// Import images
import DashboardImg from '../../assets/Dashboard.png';
import ProfileImg from '../../assets/Profile.png';
import LeaderboardImg from '../../assets/LeaderBoard.png';
import leaderboardgif from '../../assets/leaderboard.gif';
import comparisongif from '../../assets/comparison.gif';
import followgif from '../../assets/follow.gif';
import codeforcesIcon from '../../assets/codeforces.png';
import codechefIcon from '../../assets/codechef.png';
import leetcodeIcon from '../../assets/leetcode.png';
import HomeNavbar from './HomepageNavbar';
import codeaz from '../../assets/codaez.png';
import Contest from '../../assets/Contest.png';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/Loader/Loader';

const Landing = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.auth); // Get user from Redux state
    const location=useLocation();
    const state=location.state || {};

    if(state &&  Object.keys(state)?.length>0 && user && Object.keys(user)?.length>0 && state.loggedOut){
        dispatch(removeAuth());
    }

    const handleLogout = async () => {
        try {
            const data = await makeRequest.get('/logout', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('codaeztoken')}`,
                }
            });
            
            if (data.data) {
                localStorage.removeItem('codaeztoken');
                toast.success("Logged Out!", { position: "top-right" });
                dispatch(removeAuth());
            } else {
                toast.error(data.error, { position: "top-right" });
            }
        } catch (err) {
            toast.error(err.response.data.error, { position: "top-right" });
        }
    };

    const features = [
        { id: 1, icon: leaderboardgif, text: 'Collaborate with friends on the leaderboard. Track each other\'s progress, challenge your skills, and celebrate victories together!' },
        { id: 2, icon: comparisongif, text: 'Self-analysis tools help you evaluate your performance across platforms. Upskill by identifying your inflections for improvement.' },
        { id: 3, icon: followgif, text: 'Connect with fellow programmers by following them. Stay updated on their activities and learn from their coding journeys.' },
    ];

    const images = [
        { src: DashboardImg, alt: 'Dashboard', title: 'Navigate Your Success, One Insight at a Time' },
        { src: LeaderboardImg, alt: 'Leaderboard', title: 'Rise to the Top, Celebrate Your Success!' },
        { src: ProfileImg, alt: 'Profile', title: 'Showcase Your Journey, Inspire Your Network' },
        { src: Contest, alt: 'Contest', title: 'Prepare to Compete, Unleash Your Potential!' }
    ];

    const faqs = [
        { question: 'Codaez, what\'s that?? Sounds fun!! ', answer: 'Codaez is a platform for coders to connect, compete, and grow together.' },
        { question: 'How do I link my coding platform profiles to Codaez?', answer: 'After logging in, you can link your LeetCode, Codeforces, and CodeChef profiles while creating your profile. You can also edit and update these details anytime in your profile settings.' },
        { question: 'How do I change my password or username?', answer: 'You can change your password by clicking on the "Change/Set Password" link on your profile and following the instructions. To change your username, click on "Change Username" link on your profile.' },
        { question: 'How do you evaluate the standings on the Leaderboard?', answer: 'Standings are evaluated by aggregating user performance metrics from LeetCode, Codeforces, and CodeChef. We employ a min-max normalization technique to standardize the ratings from each platform, which are then combined to compute a unified aggregate rating for each user.' }
    ];


    const FAQ = ({ faqs }) => {
        const [openIndex, setOpenIndex] = useState(null);
        const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

        return (
            <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div className="faq-question" onClick={() => toggleFAQ(index)}>
                            <h4>{faq.question}</h4>
                            {openIndex === index ? <FaMinus className="faq-icon" /> : <FaPlus className="faq-icon" />}
                        </div>
                        <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const {data,loading,error}=useFetch('/landing');

    return (
        <>
        {error  ?
         "Something went wrong! Try Re-logging"
         : loading ?
            <Loader />
            :
            <div className="landing">
            <HomeNavbar user={user} handleLogout={handleLogout} />

            <section className="hero">
                <div className="hero-content">
                    <div className="content">
                        <h1>Analyze, Improve, Dominate Together</h1>
                        <p>Next-Level Analysis + Next-Level Community = Next-Level You</p>
                        <div className="buttons">
                            <Link to={'/leaderboard'}>
                                <button className="btn learn-more">Peak Performers</button>
                            </Link>
                            <Link to={'/dashboard'}>
                                <button className="btn browse-properties">Self-Analysis</button>
                            </Link>
                        </div>
                    </div>
                    <div className="stats">
                        <div className="stat"><motion.h3
                            initial={{ x: 20 }}
                            whileInView={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                        >{data.activeUsers}+</motion.h3><p>Active Users</p></div>
                        <div className="stat"><motion.h3
                            initial={{ x: 20 }}
                            whileInView={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                        >3</motion.h3><p>Platforms</p></div>
                    </div>
                </div>

                <div className='home-logos' >
                    <motion.div className='home-main-logo'
                        initial={{ scale: 0, x: 15 }}
                        whileInView={{ scale: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src={codeaz} alt="" />
                    </motion.div>
                    <div className="other-logos">
                        {[codechefIcon, codeforcesIcon, leetcodeIcon]
                            .map((circle, index) => (
                                <motion.div className="circle-cmp app__flex" key={index}
                                    initial={{ scale: 0, x: 15 }}
                                    whileInView={{ scale: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src={circle} alt="platform_icons" />
                                </motion.div>
                            ))}
                    </div>
                </div>
            </section>

            <section className="features">
                {features.map(feature => (
                    <motion.div key={feature.id} className="feature"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src={feature.icon} alt='' />
                        <p>{feature.text}</p>
                    </motion.div>
                ))}
            </section>

            <section className='project-images'>
                <div className='grid-container'>
                    <h2 className='heading'>Take a Peek Inside</h2>
                    <div className='image-grid'>
                        {images.map((image, index) => (
                            <ImageCard key={index} image={image} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <FAQ faqs={faqs} />
            <Footer />
            </div>
         }
        </>
        
    );
};

export default Landing;

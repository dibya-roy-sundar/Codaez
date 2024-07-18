import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeAuth } from '../../redux/authReducer';
import { makeRequest } from '../../hooks/makeRequest';
import ImageCard from './ImageCarousel';
import Footer from '../../components/Footer/Footer';
import './Landing.scss';

// Import images
import DashboardImg from '../../assets/Dashboard.jpeg';
import ProfileImg from '../../assets/Profile.jpeg';
import LeaderboardImg from '../../assets/LeaderBoard.jpeg'
import leaderboardgif from '../../assets/leaderboard.gif';
import comparisongif from '../../assets/comparison.gif';
import followgif from '../../assets/follow.gif'
import codeforcesIcon from '../../assets/codeforces.png';
import codechefIcon from '../../assets/codechef.png';
import leetcodeIcon from '../../assets/leetcode.png';
import HomeNavbar from './HomepageNavbar';
import codeaz from '../../assets/codaez.png';
import Contest from '../../assets/Contest.jpeg';

const Landing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.auth); // Get user from Redux state
    console.log(user);

    const handleLogout = async () => {
        try {
            const data = await makeRequest.get('/logout', { withCredentials: true });
            if (data.data) {
                toast.success("Logged Out!", { position: "top-right" });
                dispatch(removeAuth());
                navigate('/');
            } else {
                toast.error(data.error, { position: "top-right" });
            }
        } catch (err) {
            toast.error(err.response.data.error, { position: "top-right" });
        }
    };

    const features = [
        {
            id: 1, icon: leaderboardgif, text: 'Compete and collaborate with your friends on the leaderboard. Track each other’s progress, challenge your coding skills, and celebrate victories together! having fun while learning is the best way to grow.'
        },
        { id: 2, icon: followgif, text: 'Connect with fellow programmers by following them. Stay updated on their activities and learn from their coding journeys. Share insights to enhance your collective growth.' },
        { id: 3, icon: comparisongif, text: 'Utilize powerful self-analysis tools to evaluate your performance across platforms. Identify strengths, pinpoint areas for improvement, and create a personalized learning path for success.' },
    ];

    const images = [
        { src: DashboardImg, alt: 'Dashboard', title: 'Navigate Your Success, One Insight at a Time' },
        { src: ProfileImg, alt: 'Profile', title: 'Showcase Your Journey, Inspire Your Network' },
        { src: LeaderboardImg, alt: 'Leaderboard', title: 'Rise to the Top, Celebrate Your Success!' },
        { src: Contest, alt: 'Contest', title: 'Prepare to Compete, Unleash Your Potential!' }
    ];

    const handleBrowseClick = () => {
        user ? navigate('/dashboard') : navigate('/auth');
    };



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

    const faqs = [
        { question: 'What is CodeHub?', answer: 'CodeHub is a platform for coders to connect, compete, and grow together.' },
        { question: 'How can I contact support?', answer: 'You can contact support via our contact us page.' },
        { question: 'What features do you offer?', answer: 'We offer leaderboards, following features, and self-analysis tools.' },
        { question: 'How do I create a profile?', answer: 'You can create a profile by signing up and completing your details.' }
    ];
    const handleMoreClick = () => {
        user ? navigate('/leaderboard') : navigate('/auth');
    };

    return (
        <div className="landing">
            <HomeNavbar user={user} handleLogout={handleLogout} />

            <section className="hero">
                <div className="hero-content">
                    <div className="content">
                        <h1>Analyze, Improve, Dominate Together</h1>
                        <p>Next-Level Analysis + Next-Level Community = Next-Level You</p>
                        <div className="buttons">
                            <button className="btn learn-more" onClick={handleMoreClick}>Peak Performers</button>
                            <button className="btn browse-properties" onClick={handleBrowseClick}>Self-Analysis</button>
                        </div>
                    </div>
                    <section className="stats">
                        <div className="stat"><h3>200+</h3><p>Total Visitors</p></div>
                        <div className="stat"><h3>10k+</h3><p>Profiles Available</p></div>
                        <div className="stat"><h3>3</h3><p>Supported Platforms</p></div>
                    </section>

                </div>

                <div className='home-logos' >
                    <div className='home-main-logo'>
                        <img src={codeaz} alt="" />
                    </div>
                    <div className="app__header-circles">
                        {[codechefIcon, codeforcesIcon, leetcodeIcon]
                            .map((circle, index) => (
                                <div className="circle-cmp app__flex" key={`circle-${index}`}>
                                    <img src={circle} alt="platform_icons" />
                                </div>
                            ))}
                    </div>

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
                <div className='grid-container'>
                    <h2 className='heading'>Project Highlights</h2>
                    <div className='image-grid'>
                        {images.map((image, index) => (
                            <ImageCard key={index} image={image} />
                        ))}
                    </div>
                </div>
            </section>

            <FAQ faqs={faqs} />
            <Footer />
        </div>
    );
};

export default Landing;

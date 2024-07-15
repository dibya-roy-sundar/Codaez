import './Dashboard.scss';
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import DetailModal from './DetailModal';
import { useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import ContestRatingChart from './Chart'
import PieChart from './PieChart'
import ScrollDown from './ScrollDown';


const Dashboard = () => {
    const [details, setDetails] = useState({});
    const modalRef = useRef();
    const user = useSelector(state => state.auth.auth);
    const [activeContest, setActiveContest] = useState('cf'); // Default to Codeforces
    const [showDetails, setShowDetails] = useState(false);

    const handleClick = (e) => {
        setDetails({
            platform: e.target.name,
            logo: e.target.name === 'cf' ? codeforces : e.target.name === 'lc' ? leetcode : codechef,
            ...user[e.target.name]
        });
        modalRef.current.openModal();
    }
    const handleContestChange = (platform) => {
        setActiveContest(platform);
        setShowDetails(false); // Reset details when changing contests
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const dummyData = (startDate) => {
        const data = [];
        let prev = 100;
        for (let i = 0; i < 12; i++) {
            const date = new Date(startDate);
            date.setMonth(date.getMonth() + i);
            prev += 5 - Math.random() * 10;
            data.push({ x: date, y: prev });
        }
        return data;
    };

    const leetcodeData = dummyData(new Date(2022, 0, 1));
    const codeforcesData = dummyData(new Date(2022, 0, 1));
    const codechefData = dummyData(new Date(2022, 0, 1));

    return (
        <div className="dashboard">
            <DetailModal details={details} ref={modalRef} />
            <div className="section">
                <div className="cardWrapper">
                    {["cf", "lc", "cc"].map((platform) => {
                        return <div className="card" key={platform}>
                            <div className="card-img">
                                <img src={platform === "cf" ? codeforces : platform === "lc" ? leetcode : codechef} alt="" />
                            </div>
                            {user[platform]
                                ? <>
                                    <h2>{user[platform].username}</h2>
                                    <span>{Math.round(user[platform].rating) || '--'}</span>
                                    <button className="btn" name={platform} onClick={(e) => handleClick(e)}>Details</button>
                                </>
                                : <button className="btn" name="cf">Add Username</button>
                            }
                        </div>
                    })}
                </div>
                <ScrollDown />
            </div>
            <div className="charts">
                <ContestRatingChart data={leetcodeData} platform="LeetCode" />
                <ContestRatingChart data={codeforcesData} platform="Codeforces" />
                <ContestRatingChart data={codechefData} platform="CodeChef" />
            </div>
            <PieChart />
            <div className='contestlist'>
                <h2>Upcoming Contests</h2>
                <div className="contest-buttons">
                    {["cf", "lc", "cc"].map((platform) => (
                        <button
                            key={platform}
                            className={`contest-btn ${activeContest === platform ? 'active' : ''}`}
                            onClick={() => handleContestChange(platform)}
                        >
                            {platform === 'cf' ? 'Codeforces Contest' : platform === 'lc' ? 'LeetCode Contest' : 'CodeChef Contest'}
                        </button>
                    ))}
                </div>
                <div className={`contest-details ${showDetails ? 'active' : ''}`}>
                    <div className='contest-card'>
                        <h3>
                            {activeContest === 'cf'
                                ? 'Codeforces Contests'
                                : activeContest === 'lc'
                                    ? 'LeetCode Contests'
                                    : 'CodeChef Contests'}
                        </h3>
                        <button className="details-toggle" onClick={toggleDetails}>
                            {showDetails ? 'Hide Details' : 'More Details'}
                        </button>
                    </div>
                    <div>
                        {
                            showDetails && (
                                <div className='contest-details'>
                                    <div className='contest-detail'>
                                        <h4>Contest 1</h4>
                                        <p>Details of Contest 1</p>
                                    </div>
                                    {/* Add more contest details as needed */}
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Dashboard;
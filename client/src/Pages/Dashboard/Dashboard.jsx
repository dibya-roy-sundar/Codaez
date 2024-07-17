import './Dashboard.scss';
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ContestRatingChart from './Chart'
import PieChart from './PieChart'
import { setAuth } from '../../redux/authReducer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';


const Dashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, loading, error } = useFetch("/dashboard");
    const user = data.user
    console.log(user)

    useEffect(() => {
        if (searchParams.get('email') && searchParams.get('username')) {
            dispatch(setAuth({
                email: searchParams.get('email'),
                name: searchParams.get('name') || '',
                username: searchParams.get('username'),
            }))
            navigate('', { replace: true });
        }
    }, []);

    const [activePlatform, setActivePlatform] = useState('cf');
    const [lineGraphData, setLineGraphData] = useState([]);
    const [pieChartData, setPieChartData] = useState({});
    useEffect(() => {
        setDetails(user?.[`${activePlatform}`]);
        const contestPaticipation = user?.[`${activePlatform}`]?.contestParticipation

        const data = [];
        let prev = 100;
        for (let i = 0; i < contestPaticipation?.length; i++) {
            let date;
            if (activePlatform === 'cc') {
                date = new Date(contestPaticipation[i].year, contestPaticipation[i].month - 1, contestPaticipation[i].date)
            }
            else {
                date = new Date(contestPaticipation[i]?.time * 1000);
            }
            data.push({ x: date, y: contestPaticipation[i]?.rating });
        }
        setLineGraphData(data)

        let piedata = {}
        if (activePlatform === 'cf') {
            const questionData = user?.cf?.ratingWiseProblems
            for (let i = 0; i < questionData?.length; i++) {
                piedata[`${questionData[i].rating}`] = questionData[i].count;
            }
        }
        else if (activePlatform === 'lc') {
            piedata.Easy = user?.lc?.easyquestions
            piedata.Medium = user?.lc?.mediumquestions
            piedata.Hard = user?.lc?.hardquestions
        }
        else {
            piedata = null
        }
        setPieChartData(piedata)

    }, [user, activePlatform])

    const [details, setDetails] = useState({});









    const [showDetails, setShowDetails] = useState(false);
    const [activeContest, setActiveContest] = useState('cf'); // Default to Codeforces

    const handleContestChange = (platform) => {
        setActiveContest(platform);
        setShowDetails(false); // Reset details when changing contests
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div className="dashboard">
            {error
                ? "error"
                : loading
                    ? "loading"
                    : <div className="section">
                        <div className='buttonWrapper'>
                            <div className={`platformBtn ${activePlatform === 'cf' ? 'activePlatform' : ''}`} onClick={() => setActivePlatform('cf')}>
                                <img src={codeforces} alt="" />
                                <span className='username'>{user?.cf?.username}</span>
                            </div>
                            <div className={`platformBtn ${activePlatform === 'lc' ? 'activePlatform' : ''}`} onClick={() => setActivePlatform('lc')}>
                                <img src={leetcode} alt="" />
                                <span className='username'>{user?.lc?.username}</span>
                            </div>
                            <div className={`platformBtn ${activePlatform === 'cc' ? 'activePlatform' : ''}`} onClick={() => setActivePlatform('cc')}>
                                <img src={codechef} alt="" />
                                <span className='username'>{user?.cc?.username}</span>
                            </div>
                        </div>

                        <div className="detailsSection">
                            <div className="topDetails">
                                {details?.contestParticipation && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Contests</span>
                                        <span className='data'>{details?.contestParticipation.length}</span>
                                    </div>
                                </div>}
                                {details?.rating && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Rating</span>
                                        <span className='data'>{details?.rating}</span>
                                    </div>
                                </div>}
                                {details?.maxRating && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Max Rating</span>
                                        <span className='data'>{details?.maxRating}</span>
                                    </div>
                                </div>}
                                {details?.rank && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Rank</span>
                                        <span className='data'>{details?.rank}</span>
                                    </div>
                                </div>}
                                {details?.maxRank && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Max Rank</span>
                                        <span className='data'>{details?.maxRank}</span>
                                    </div>
                                </div>}
                                {details?.totalSuccessfullSubmissions && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Submissions</span>
                                        <span className='data'>{details?.totalSuccessfullSubmissions}</span>
                                    </div>
                                </div>}

                                {details?.badge && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Badge</span>
                                        <span className='data'>{details?.badge}</span>
                                    </div>
                                </div>}
                                {details?.topPercentage && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Top Percentage</span>
                                        <span className='data'>{details?.topPercentage}</span>
                                    </div>
                                </div>}
                                {details?.totalquestions && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Problems</span>
                                        <span className='data'>{details?.totalquestions}</span>
                                    </div>
                                </div>}

                                {details?.countryRank && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Country Rank</span>
                                        <span className='data'>{details?.countryRank}</span>
                                    </div>
                                </div>}
                                {details?.stars && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Stars</span>
                                        <span className='data'>{details?.stars}</span>
                                    </div>
                                </div>}
                                {details?.totalProblemSolved && <div className="eachDetail">
                                    <img src={leetcode} alt="" />
                                    <div className="content">
                                        <span className='heading'>Problems</span>
                                        <span className='data'>{details?.totalProblemSolved}</span>
                                    </div>
                                </div>}
                            </div>
                            <div className="graphs">
                                <div className="lineGraph">
                                    <ContestRatingChart data={lineGraphData} platform={activePlatform} />
                                </div>
                                {pieChartData && <div className="piechart">
                                    <PieChart data={pieChartData} platform={activePlatform} />
                                </div>}
                            </div>
                        </div>
                    </div>
            }
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
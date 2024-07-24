import './Dashboard.scss';
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LineGraph from './LineGraph'
import PieChart from './PieChart'
import { setAuth } from '../../redux/authReducer';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { BiLinkExternal } from "react-icons/bi";
import usernameNotFound from "../../assets/usernameNotFound.png";
import noContestFound from "../../assets/noContestFound.png";
import question from '../../assets/flaticon/question.gif'
import contest from '../../assets/flaticon/contest.gif'
import upRightArrow from '../../assets/flaticon/up-right-arrow.gif'
import ratings from '../../assets/flaticon/ratings.gif'
import bestQuality from '../../assets/flaticon/best-quality.gif'
import blackFriday from '../../assets/flaticon/black-friday.gif'
import militaryMedal from '../../assets/flaticon/military-medal.gif'
import flags from '../../assets/flaticon/flags.gif'
import favourite from '../../assets/flaticon/favourite.gif'
import chart from '../../assets/flaticon/chart.gif'
import upcoming from '../../assets/flaticon/upcoming.gif'
import Loader from '../../components/Loader/Loader';
import UpcomingContests from './UpcomingContests';

const Dashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [reload, setReload] = useState(0);
    const { data, loading, error } = useFetch("/dashboard", true, reload);
    const user = data.user

    useEffect(() => {
        if (searchParams.get('email') && searchParams.get('username') && searchParams.get('token')) {
            localStorage.setItem('token', searchParams.get('token'))

            setReload(prev => prev + 1);

            dispatch(setAuth({
                email: searchParams.get('email'),
                name: searchParams.get('name') || '',
                username: searchParams.get('username'),
            }))
            navigate('', { replace: true });
        }
    }, []);

    const [activePlatform, setActivePlatform] = useState('cf');
    const [lineGraphData, setLineGraphData] = useState(null);
    const [pieChartData, setPieChartData] = useState({});
    const [details, setDetails] = useState({});

    useEffect(() => {
        setDetails(user?.[`${activePlatform}`]);
        const contestPaticipation = user?.[`${activePlatform}`]?.contestParticipation

        const data = [];
        for (let i = 0; i < contestPaticipation?.length; i++) {
            let date;
            if (activePlatform === 'cc') {
                date = new Date(contestPaticipation[i].year, contestPaticipation[i].month - 1, contestPaticipation[i].date)
            }
            else {
                date = new Date(contestPaticipation[i]?.time * 1000);
            }
            data.push({ x: date, y: contestPaticipation[i]?.rating, rank: contestPaticipation[i]?.rank });
        }
        setLineGraphData(data?.length > 0 ? data : null)

        let piedata = {}
        if (activePlatform === 'cf') {
            const questionData = user?.cf?.ratingWiseProblems
            for (let i = 0; i < questionData?.length; i++) {
                piedata[`${questionData[i].rating}`] = questionData[i].count;
            }
        }
        else if (activePlatform === 'lc') {
            if (user?.lc?.easyquestions)
                piedata.Easy = user?.lc?.easyquestions
            if (user?.lc?.mediumquestions)
                piedata.Medium = user?.lc?.mediumquestions
            if (user?.lc?.hardquestions)
                piedata.Hard = user?.lc?.hardquestions
        }
        else {
            piedata = null
        }
        setPieChartData(piedata ? Object.keys(piedata).length ? piedata : null : null)
    }, [user, activePlatform])


    return (
        <div className="dashboard">
            {error
                ? "Something went wrong!"
                : loading
                    ? <Loader />
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
                                {details?.contestParticipation?.length > 0 && <div className="eachDetail">
                                    <img src={contest} alt="" />
                                    <div className="content">
                                        <span className='heading'>Contests</span>
                                        <span className='data'>{details?.contestParticipation.length}</span>
                                    </div>
                                </div>}
                                {details?.rating && <div className="eachDetail">
                                    <img src={chart} alt="" />
                                    <div className="content">
                                        <span className='heading'>Rating</span>
                                        <span className='data'>{details?.rating}</span>
                                    </div>
                                </div>}
                                {details?.maxRating && <div className="eachDetail">
                                    <img src={upRightArrow} alt="" />
                                    <div className="content">
                                        <span className='heading'>Max Rating</span>
                                        <span className='data'>{details?.maxRating}</span>
                                    </div>
                                </div>}
                                {details?.rank && <div className="eachDetail">
                                    <img src={militaryMedal} alt="" />
                                    <div className="content">
                                        <span className='heading'>Rank</span>
                                        <span className='data'>{details?.rank}</span>
                                    </div>
                                </div>}
                                {details?.maxRank && <div className="eachDetail">
                                    <img src={ratings} alt="" />
                                    <div className="content">
                                        <span className='heading'>Max Rank</span>
                                        <span className='data'>{details?.maxRank}</span>
                                    </div>
                                </div>}
                                {details?.totalSuccessfullSubmissions > 0 ? <div className="eachDetail">
                                    <img src={question} alt="" />
                                    <div className="content">
                                        <span className='heading'>Submissions</span>
                                        <span className='data'>{details?.totalSuccessfullSubmissions}</span>
                                    </div>
                                </div>
                                    : details?.totalSuccessfullSubmissions == 0 && 'No Submission Found'
                                }

                                {details?.badge && <div className="eachDetail">
                                    <img src={bestQuality} alt="" />
                                    <div className="content">
                                        <span className='heading'>Badge</span>
                                        <span className='data'>{details?.badge}</span>
                                    </div>
                                </div>}
                                {details?.topPercentage && <div className="eachDetail">
                                    <img src={blackFriday} alt="" />
                                    <div className="content">
                                        <span className='heading'>Top Percentage</span>
                                        <span className='data'>{details?.topPercentage}</span>
                                    </div>
                                </div>}
                                {details?.totalquestions ? <div className="eachDetail">
                                    <img src={question} alt="" />
                                    <div className="content">
                                        <span className='heading'>Problems</span>
                                        <span className='data'>{details?.totalquestions}</span>
                                    </div>
                                </div>
                                    : details?.totalquestions == 0 && 'No Submission Found'}

                                {details?.countryRank && <div className="eachDetail">
                                    <img src={flags} alt="" />
                                    <div className="content">
                                        <span className='heading'>Country Rank</span>
                                        <span className='data'>{details?.countryRank}</span>
                                    </div>
                                </div>}
                                {details?.stars && <div className="eachDetail">
                                    <img src={favourite} alt="" />
                                    <div className="content">
                                        <span className='heading'>Stars</span>
                                        <span className='data'>{details?.stars}</span>
                                    </div>
                                </div>}
                                {details?.totalProblemSolved ? <div className="eachDetail">
                                    <img src={question} alt="" />
                                    <div className="content">
                                        <span className='heading'>Problems</span>
                                        <span className='data'>{details?.totalProblemSolved}</span>
                                    </div>
                                </div>
                                    : details?.totalProblemSolved == 0 && 'No Submission Found'}
                                {!user?.[`${activePlatform}`]?.username
                                    ? <div className="noUsername">
                                        <img src={usernameNotFound} alt="" />
                                        <div className='notFound'>Username Not Found</div>
                                        <Link to={`/profile/${user?.username}`} className='setBtn'>
                                            Set Now <BiLinkExternal />
                                        </Link>
                                    </div>
                                    : null}
                            </div>
                            <div className="graphs">
                                {lineGraphData && lineGraphData.length>0 && <div className="lineGraph">
                                    <LineGraph data={lineGraphData} platform={activePlatform} />
                                </div>}
                                {pieChartData && activePlatform === 'cf' && <div className="piechart">
                                    <PieChart data={pieChartData} platform={activePlatform} />
                                </div>}
                                {pieChartData && activePlatform === 'lc' && <div className="piechart">
                                    <PieChart data={pieChartData} platform={activePlatform} />
                                </div>}
                            </div>
                        </div>
                        <UpcomingContests data={data}/>
                    </div>
            }
        </div>

    )
}

export default Dashboard;
import './Dashboard.scss';
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import DetailModal from './DetailModal';
import { useState } from 'react';
import { useRef } from 'react';

const user = {
    lc: {
        username: "vanshulagarwal2004",
        rating: 1682.4428300092843,
        rank: 76563,
        topPercentage: 14.14,
        badge: null,
        attendedContestsCount: 17
    },
    cf: {
        username: "vanshulagarwal",
        rating: 1053,
        rank: "newbie",
        maxRating: 1192,
        maxRank: "newbie"
    },
    cc: {
        username: "vanshulagarwal",
        rating: 1308,
        maxRating: 1336,
        rank: 61341,
        countryRank: 56620,
        stars: "1★"
    },
}

const Dashboard = () => {
    const [details, setDetails] = useState({});
    const modalRef = useRef();

    const handleClick = (e) => {
        setDetails({
            platform: e.target.name,
            logo: e.target.name === 'cf' ? codeforces : e.target.name === 'lc' ? leetcode : codechef,
            ...user[e.target.name]
        });
        modalRef.current.openModal();
    }

    return (
        <div className="dashboard">
            <DetailModal details={details} ref={modalRef} />
            <div className="section">
                <div className="cardWrapper">
                    <div className="card">
                        <div className="card-img">
                            <img src={codeforces} alt="" />
                        </div>
                        <h2>{user.cf.username}</h2>
                        <span>{user.cf.rating}</span>
                        <button className="btn" name="cf" onClick={(e) => handleClick(e)}>Details</button>
                    </div>
                    <div className="card">
                        <div className="card-img">
                            <img src={leetcode} alt="" />
                        </div>
                        <h2>{user.lc.username}</h2>
                        <span>{Math.round(user.lc.rating)}</span>
                        <button className="btn" name="lc" onClick={(e) => handleClick(e)}>Details</button>
                    </div><div className="card">
                        <div className="card-img">
                            <img src={codechef} alt="" />
                        </div>
                        <h2>{user.cc.username}</h2>
                        <span>{user.cc.rating}</span>
                        <button className="btn" name="cc" onClick={(e) => handleClick(e)}>Details</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
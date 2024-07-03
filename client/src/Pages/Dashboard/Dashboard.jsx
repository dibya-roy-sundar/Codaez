import './Dashboard.scss';
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import DetailModal from './DetailModal';
import { useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';


const Dashboard = () => {
    const [details, setDetails] = useState({});
    const modalRef = useRef();
    const user = useSelector(state => state.auth.auth);

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
                    {["cf", "lc", "cc"].map((platform) => {
                        return <div className="card">
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
            </div>
        </div>
    )
}

export default Dashboard;
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import './Sidebar.scss';
import codeforces from '../../assets/codeforces.png';
import { makeRequest } from "../../hooks/makeRequest";
import { removeAuth } from "../../redux/authReducer";
import { useDispatch } from "react-redux";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const handleLogout = async () => {

        try {
            const data = await makeRequest.get('/logout', {
                withCredentials: true
            });

            if (data.data) {
                console.log({ data: data.data });
                // dispatch(setAuth(data.data));
                // toast.success("Logged Out!", {
                //     position: toast.POSITION.TOP_LEFT
                // });
                dispatch(removeAuth());
                navigate('/');
            }
            else {
                console.log({ error: data.error })
                // toast.error(data.error, {
                //     position: toast.POSITION.TOP_LEFT
                // });
            }
        } catch (err) {
            console.log(err);
            // toast.error(err.response.data.error, {
            //     position: toast.POSITION.TOP_LEFT
            // });
            console.log({
                success: false,
                status: err.response.status,
                error: `${err.response.data.error}`
            })
        }
    }

    return (
        <div className="sidebar">
            <div className="top">
                <Link to={'/'}>
                    <img src={codeforces} alt="" />
                </Link>
            </div>
            <div className="middle">
                <Link to={'/dashboard'} className="linkBlock"><MdDashboard /><span className="linktag">Dashboard</span></Link>
                <Link to={'/leaderboard'} className="linkBlock"><MdLeaderboard /><span className="linktag">Leaderboard</span></Link>
                <Link to={'/profile'} className="linkBlock"><CgProfile /><span className="linktag">Profile</span></Link>
            </div>
            <div className="bottom linkBlock" onClick={handleLogout}>
                <FiLogOut color="red" /><span className="linktag">Logout</span>
            </div>
        </div>
    )
}

export default Sidebar;
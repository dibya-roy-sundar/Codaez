import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import './Sidebar.scss';
import { makeRequest } from "../../hooks/makeRequest";
import { removeAuth } from "../../redux/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import codaez from '../../assets/codaez.png'

const Sidebar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.auth);
    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            const data = await makeRequest.get('/logout', {
                withCredentials: true
            });

            if (data.data) {
                console.log({ data: data.data });
                toast.success("Logged Out!", {
                    position: "top-right"
                });
                navigate("/", { state: { loggedOut: true } });
            }
            else {
                console.log({ error: data.error })
                toast.error(data.error, {
                    position: "top-right"
                });
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.error, {
                position: "top-right"
            });
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
                    <img src={codaez} alt="" />
                    <span>Cod<span className="purple">a</span>e<span className="purple">z</span></span>
                </Link>
            </div>
            <div className="middle">
                <Link to={'/dashboard'} className="linkBlock"><MdDashboard /><span className="linktag">Dashboard</span></Link>
                <Link to={'/leaderboard'} className="linkBlock"><MdLeaderboard /><span className="linktag">Leaderboard</span></Link>
                <Link to={`/profile/${user.username}`} className="linkBlock"><CgProfile /><span className="linktag">Profile</span></Link>
            </div>
            <div className="bottom" onClick={handleLogout}>
                <div className="linkBlock"><FiLogOut color="red" /><span className="linktag">Logout</span></div>
            </div>
        </div>
    )
}

export default Sidebar;
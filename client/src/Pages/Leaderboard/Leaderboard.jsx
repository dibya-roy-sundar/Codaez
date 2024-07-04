import './Leaderboard.scss';
import useFetch from '../../hooks/useFetch';
import noProfileImage from '../../assets/noProfileImage.png';
import codeforces from '../../assets/codeforces.png';
import leetcode from '../../assets/leetcode.png';
import codechef from '../../assets/codechef.png';
import { FaSortUp } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";
import { FaSort } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa";

const Leaderboard = () => {
    // const { data, loading, error } = useFetch('/details/leaderboard');
    // console.log(data.result);

    return (
        <div className="leaderboard">
            {/* {error
                ? "error"
                : loading
                    ? "loading"
                    : ""
            } */}
            <div className="top">
                <div className="stair">
                    <div className="profilepic">
                        <FaTrophy fontSize={24} color='silver' />
                        <img src={noProfileImage} alt="" />
                    </div>
                    <div className="skewbox"></div>
                    <div className="verticalbox second">
                        <div className="username">@vanshulagarwal</div>
                        <div className="ratingsWrapper">
                            <div className='ratings'>
                                <span><img src={codeforces} alt="" /></span>
                                1685
                            </div>
                            <div className='ratings'>
                                <span><img src={leetcode} alt="" /></span>
                                1685
                            </div>
                            <div className='ratings'>
                                <span><img src={codechef} alt="" /></span>
                                1685
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stair">
                    <div className="profilepic">
                        <FaTrophy fontSize={24} color='gold' />
                        <img src={noProfileImage} alt="" />
                    </div>
                    <div className="skewbox"></div>
                    <div className="verticalbox first">
                        <div className="username">@vanshulagarwal</div>
                        <div className="ratingsWrapper">
                            <div className='ratings'>
                                <span><img src={codeforces} alt="" /></span>
                                1685
                            </div>
                            <div className='ratings'>
                                <span><img src={leetcode} alt="" /></span>
                                1685
                            </div>
                            <div className='ratings'>
                                <span><img src={codechef} alt="" /></span>
                                1685
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stair">
                    <div className="profilepic">
                        <FaTrophy fontSize={24} color='#cd7f32' />
                        <img src={noProfileImage} alt="" />
                    </div>
                    <div className="skewbox"></div>
                    <div className="verticalbox third">
                        <div className="username">@vanshulagarwal</div>
                        <div className="ratingsWrapper">
                            <div className='ratings'>
                                <span><img src={codeforces} alt="" /></span>
                                1685
                            </div>
                            <div className='ratings'>
                                <span><img src={leetcode} alt="" /></span>
                                1685
                            </div>
                            <div className='ratings'>
                                <span><img src={codechef} alt="" /></span>
                                1685
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="colHeading">
                    <div className='position'>Place</div>
                    <div className='user-Img-Name'>User</div>
                    <div className="codeforces rating">
                        <span><img src={codeforces} alt="" /></span>
                        <span className='sortArrows'>
                            <FaSort />
                            {/* <FaSortUp /> */}
                            {/* <FaSortDown /> */}
                        </span>
                    </div>
                    <div className="leetcode rating">
                        <span><img src={leetcode} alt="" /></span>
                        <span className='sortArrows'>
                            <FaSort />
                            {/* <FaSortUp /> */}
                            {/* <FaSortDown /> */}
                        </span>
                    </div>
                    <div className="codechef rating">
                        <span><img src={codechef} alt="" /></span>
                        <span className='sortArrows'>
                            <FaSort />
                            {/* <FaSortUp /> */}
                            {/* <FaSortDown /> */}
                        </span>
                    </div>
                </div>
                <div className="eachUser">
                    <div className='position'><div className="digit">1</div></div>
                    <div className='user-Img-Name'>
                        <div className="profileImage">
                            <img src={noProfileImage} alt="" />
                        </div>
                        <div className="username">
                            <span className="name">Vanshul Agarwal</span>
                            <span className='usernameBlock'>@vanshulagarwal</span>
                        </div>
                    </div>
                    <div className="codeforces rating">1685</div>
                    <div className="leetcode rating">1685</div>
                    <div className="codechef rating">1685</div>
                </div>
                <div className="eachUser">
                    <div className='position'><div className="digit">1</div></div>
                    <div className='user-Img-Name'>
                        <div className="profileImage">
                            <img src={noProfileImage} alt="" />
                        </div>
                        <div className="username">
                            <span className="name">Vanshul Agarwal</span>
                            <span className='usernameBlock'>@vanshulagarwal</span>
                        </div>
                    </div>
                    <div className="codeforces rating">1685</div>
                    <div className="leetcode rating">1685</div>
                    <div className="codechef rating">1685</div>
                </div>
                <div className="eachUser">
                    <div className='position'><div className="digit">1</div></div>
                    <div className='user-Img-Name'>
                        <div className="profileImage">
                            <img src={noProfileImage} alt="" />
                        </div>
                        <div className="username">
                            <span className="name">Vanshul Agarwal</span>
                            <span className='usernameBlock'>@vanshulagarwal</span>
                        </div>
                    </div>
                    <div className="codeforces rating">1685</div>
                    <div className="leetcode rating">1685</div>
                    <div className="codechef rating">1685</div>
                </div>
                <div className="eachUser">
                    <div className='position'><div className="digit">1</div></div>
                    <div className='user-Img-Name'>
                        <div className="profileImage">
                            <img src={noProfileImage} alt="" />
                        </div>
                        <div className="username">
                            <span className="name">Vanshul Agarwal</span>
                            <span className='usernameBlock'>@vanshulagarwal</span>
                        </div>
                    </div>
                    <div className="codeforces rating">1685</div>
                    <div className="leetcode rating">1685</div>
                    <div className="codechef rating">1685</div>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;
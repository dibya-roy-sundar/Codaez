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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import codaez from '../../assets/codaez.png'
import Loader from '../../components/Loader/Loader';

const Leaderboard = () => {
    const { data, loading, error } = useFetch('/details/leaderboard');
    const [list, setList] = useState(null);

    useEffect(() => {
        const listFromData = data?.result?.leaderboard
        listFromData?.sort((a, b) => b.aggregateRating - a.aggregateRating)
        setList(listFromData);
    }, [data])

    const [defaultDesc, setDefaultDesc] = useState(true);
    const [sortBy, setSortBy] = useState({ platform: '', order: '' });

    const handleSortByChange = (clickedBy) => {
        if (sortBy.platform == clickedBy && sortBy.order == 'desc') {
            list?.sort((a, b) => {
                if (a[clickedBy]?.rating - b[clickedBy]?.rating != 0)
                    return a[clickedBy]?.rating - b[clickedBy]?.rating
                else
                    return a?.aggregateRating - b?.aggregateRating
            })
            setSortBy({ platform: clickedBy, order: 'asc' })
        }
        else {
            list?.sort((a, b) => {
                if (b[clickedBy]?.rating - a[clickedBy]?.rating != 0)
                    return b[clickedBy]?.rating - a[clickedBy]?.rating
                else
                    return b?.aggregateRating - a?.aggregateRating
            })
            setSortBy({ platform: clickedBy, order: 'desc' })
        }
        setDefaultDesc(false)
    }

    const handleSortReset = () => {
        if (defaultDesc) {
            list?.sort((a, b) => a.aggregateRating - b.aggregateRating)
            setDefaultDesc(false)
        }
        else {
            list?.sort((a, b) => b.aggregateRating - a.aggregateRating)
            setDefaultDesc(true)
        }
        setSortBy({ platform: '', order: '' })
    }

    return (
        <div className="leaderboard">
            {error
                ? "Something went wrong! Try Re-logging"
                : loading
                    ? <Loader />
                    : <>
                        <div className="top">
                            {list && list[1] &&
                                <div className="stair">
                                    <div className="profilepic">
                                        <FaTrophy fontSize={24} color='silver' />
                                        <img src={list[1].imgUrl || noProfileImage} alt="" />
                                    </div>
                                    <div className="skewbox"></div>
                                    <div className="verticalbox second">
                                        <div className="username">
                                            <span className="name">{list[1].name}</span>
                                            <Link to={`/profile/${list[1].username}`} className="usernameBlock">@{list[1].username}</Link>
                                        </div>
                                        <div className="ratingsWrapper">
                                            {list[1]?.cf?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={codeforces} alt="" /></span>
                                                    {list[1].cf.rating}
                                                </div>
                                            }
                                            {list[1]?.lc?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={leetcode} alt="" /></span>
                                                    {list[1].lc.rating}
                                                </div>
                                            }
                                            {list[1]?.cc?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={codechef} alt="" /></span>
                                                    {list[1].cc.rating}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            {list && list[0] &&
                                <div className="stair">
                                    <div className="profilepic">
                                        <FaTrophy fontSize={24} color='gold' />
                                        <img src={list[0].imgUrl || noProfileImage} alt="" />
                                    </div>
                                    <div className="skewbox"></div>
                                    <div className="verticalbox first">
                                        <div className="username">
                                            <span className="name">{list[0].name}</span>
                                            <Link to={`/profile/${list[0].username}`} className="usernameBlock">@{list[0].username}</Link>
                                        </div>
                                        <div className="ratingsWrapper">
                                            {list[0]?.cf?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={codeforces} alt="" /></span>
                                                    {list[0].cf.rating}
                                                </div>
                                            }
                                            {list[0]?.lc?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={leetcode} alt="" /></span>
                                                    {list[0].lc.rating}
                                                </div>
                                            }
                                            {list[0]?.cc?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={codechef} alt="" /></span>
                                                    {list[0].cc.rating}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            {list && list[2] &&
                                <div className="stair">
                                    <div className="profilepic">
                                        <FaTrophy fontSize={24} color='#cd7f32' />
                                        <img src={list[2].imgUrl || noProfileImage} alt="" />
                                    </div>
                                    <div className="skewbox"></div>
                                    <div className="verticalbox third">
                                        <div className="username">
                                            <span className="name">{list[2].name}</span>
                                            <Link to={`/profile/${list[2].username}`} className="usernameBlock">@{list[2].username}</Link>
                                        </div>
                                        <div className="ratingsWrapper">
                                            {list[2]?.cf?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={codeforces} alt="" /></span>
                                                    {list[2].cf.rating}
                                                </div>
                                            }
                                            {list[2]?.lc?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={leetcode} alt="" /></span>
                                                    {list[2].lc.rating}
                                                </div>
                                            }
                                            {list[2]?.cc?.rating &&
                                                <div className='ratings'>
                                                    <span><img src={codechef} alt="" /></span>
                                                    {list[2].cc.rating}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="bottom">
                            <div className="colHeading">
                                <div className='position'>Place</div>
                                <div className='user-Img-Name'>User</div>
                                <div className="codeforces rating" onClick={() => handleSortByChange("cf")}>
                                    <span><img src={codeforces} alt="" /></span>
                                    <span className='sortArrows'>
                                        {sortBy.platform === "cf"
                                            ? sortBy.order === "desc"
                                                ? <FaSortUp />
                                                : <FaSortDown />
                                            : <FaSort />}
                                    </span>
                                </div>
                                <div className="leetcode rating" onClick={() => handleSortByChange("lc")}>
                                    <span><img src={leetcode} alt="" /></span>
                                    <span className='sortArrows'>
                                        {sortBy.platform === "lc"
                                            ? sortBy.order === "desc"
                                                ? <FaSortUp />
                                                : <FaSortDown />
                                            : <FaSort />}
                                    </span>
                                </div>
                                <div className="codechef rating" onClick={() => handleSortByChange("cc")}>
                                    <span><img src={codechef} alt="" /></span>
                                    <span className='sortArrows'>
                                        {sortBy.platform === "cc"
                                            ? sortBy.order === "desc"
                                                ? <FaSortUp />
                                                : <FaSortDown />
                                            : <FaSort />}
                                    </span>
                                </div>
                                <div className="aggregate rating" onClick={handleSortReset}>
                                    <span className='codaezLogo'>
                                        <img src={codaez} alt="" />
                                        <span>Cod<span className="purple">a</span>e<span className="purple">z</span></span>
                                    </span>
                                    <span className='sortArrows'>
                                        {sortBy.platform === ""
                                            ? defaultDesc
                                                ? <FaSortUp />
                                                : <FaSortDown />
                                            : <FaSort />}
                                    </span>
                                </div>
                            </div>
                            {list && list.map((user, ind) => (
                                <div className={`eachUser ${user.username == data?.result?.currUserDetails?.username && 'myDetails'}`} key={ind} >
                                    <div className='position'><div className="digit">{ind + 1}</div></div>
                                    <div className='user-Img-Name'>
                                        <div className="profileImage">
                                            <img src={user?.imgUrl || noProfileImage} alt="" />
                                        </div>
                                        <div className="username">
                                            <span className="name">{user?.name}</span>
                                            <Link to={`/profile/${user?.username}`} className="usernameBlock">@{user?.username}</Link>
                                        </div>
                                    </div>
                                    <div className="codeforces rating">{user?.cf?.rating}</div>
                                    <div className="leetcode rating">{user?.lc?.rating ? Math.round(user?.lc?.rating) : ''}</div>
                                    <div className="codechef rating">{user?.cc?.rating}</div>
                                    <div className="aggregate rating">{user?.aggregateRating}</div>
                                </div>
                            ))
                            }
                        </div>
                    </>
            }
        </div>
    )
}

export default Leaderboard;
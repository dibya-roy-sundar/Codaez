/* eslint-disable react-hooks/rules-of-hooks */
import "./Profile.scss";
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import linkedin from "../../assets/linkedin.png";
import github from "../../assets/github.png";
import twitter from "../../assets/twitter.png";
import noProfileImage from "../../assets/noProfileImage.png"
import Labelinput from "./Labelinput";
import { useEffect, useRef, useState } from "react";
import { FaBan } from "react-icons/fa";
import { FaAngleRight, FaEnvelope, FaFloppyDisk, FaGithub, FaGraduationCap, FaHashnode, FaIdCard, FaKey, FaLinkedin, FaMedium, FaPencil, FaPenToSquare, FaUser, FaXTwitter } from "react-icons/fa6";
import ChangePw from "./ChangePw";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import usePutHook from "../../hooks/usePutHook";
import { setAuth } from "../../redux/authReducer";
import usePostFetch from "../../hooks/usePostFetch";
import Changeuname from "./Changeuname.jsx";
import { toast } from "react-toastify";
import Follow from "./Follow.jsx";
import { ClipLoader } from "react-spinners";



const Profile = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const current_user = useSelector(state => state.auth.auth)
    const [reload, setReload] = useState(0);
    const [followReload, setFollowReload] = useState(0);

    const { username } = useParams();
    const ownprofile = current_user?.username === username;

    const { data, loading, error } = useFetch(`/profile/${username}`, true, reload);

    useEffect(() => {
        if (ownprofile && data && data.user) {
            //only for showing updates on following 
            // othwerwise follow updated when user accept follow request    
            dispatch(setAuth(data.user));
        }
    }, [data])


    let user, isFollowing, isRequested;
    if (ownprofile) {
        user = current_user
    }
    else {
        user = data.user;
        isFollowing = data.isfollowing;
        isRequested = data.isrequested;
    }



    const [edit, setEdit] = useState(false);
    const [sendfr, setSendfr] = useState(false);
    const changepwref = useRef();
    const changeusernameref = useRef();
    const followRef = useRef();
    const editavatarref = useRef();

    const [formdata, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        college: '',
        lc: '',
        cf: '',
        cc: '',
        linkedin: '',
        github: '',
        twitter: '',
        hashnode: '',
        medium: '',
    });

    useEffect(() => {
        if (ownprofile) {
            setFormData({
                name: current_user?.name || '',
                username: current_user?.username,
                email: current_user?.email,
                college: current_user?.college || '',
                lc: current_user?.lc?.username || '',
                cf: current_user?.cf?.username || '',
                cc: current_user?.cc?.username || '',
                linkedin: current_user?.linkedin || '',
                github: current_user?.github || '',
                twitter: current_user?.twitter || '',
                hashnode: current_user?.hashnode || '',
                medium: current_user?.medium || '',
            })
        }

    }, [current_user, edit])

    const changeFormdata = (field, value) => {
        setFormData((prev) => {
            return {
                ...prev,
                [field]: value
            }
        })
    }

    const [isProfileSubmitting, setisProfileSubmitting] = useState(false);
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (isProfileSubmitting) return;

        try {
            setisProfileSubmitting(true);
            const data = await usePutHook('/update-profile', formdata);

            if (data.data && data.data.user) {
                toast.success(`Profile Updated!`, {
                    position: "top-right"
                });
                dispatch(setAuth(data.data.user));
                setEdit(false);
                setFollowReload(reload => reload + 1);
            }
            else if (data.data) {
                toast.warn(data.data.error || data.data.message, {
                    position: "top-right"
                });
            }
            else {
                toast.error(data.error, {
                    position: "top-right"
                });
            }
        } catch (error) {
            toast.error(error.message || "something went wrong!", {
                position: "top-right"
            });
        } finally {
            setisProfileSubmitting(false);
        }

    }



    const triggerFileInput = () => {
        editavatarref.current.click();
    }

    const handleEditAvatar = async (e) => {
        e.preventDefault();
        setEdit(false);

        const data = await usePutHook('/update-avatar', {
            avatar: e.target.files[0],
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (data.data && data.data.user) {
            toast.success(`Avatar Updated`, {
                position: "top-right"
            });
            dispatch(setAuth(data.data.user));
        }
        else if (data.data) {
            toast.warn(data.data.error || data.data.message, {
                position: "top-right"
            });
        }
        else {
            console.log(data);
            toast.error(data.error, {
                position: "top-right"
            });
        }
    }

    const handleSendFollowRequest = async () => {
        const data = await usePostFetch('/sendfrequest', { userId: user?._id });

        if (data.data && data.data.success) {
            setSendfr(true);
        }
        else if (data.data) {
            toast.warn(data.data.error || data.data.message, {
                position: "top-right"
            });
        }
        else {
            console.log(data);
            toast.error(data.error, {
                position: "top-right"
            });
        }

    }

    const handleWithdrawFollowRequest = async () => {
        const data = await usePostFetch('/withdraw-request', { userId: user?._id });
        if (data.data && data.data.success) {
            // console.log(data.msg); toastify
            setSendfr(false);
        }
        else if (data.data) {
            toast.warn(data.data.error || data.data.message, {
                position: "top-right"
            });
        }
        else {
            console.log(data);
            toast.error(data.error, {
                position: "top-right"
            });
        }
    }
    const handleUnfollow = async () => {
        const data = await usePostFetch('/unfollow', { userId: user?._id });

        if (data.data && data.data.success) {
            // console.log(data.msg); toastify
            setReload(prev => prev + 1);
            dispatch(setAuth(data.data.curr_user));
        }
        else if (data.data) {
            toast.warn(data.data.error || data.data.message, {
                position: "top-right"
            });
        }
        else {
            console.log(data);
            toast.error(data.error, {
                position: "top-right"
            });
        }

    }

    const openPwModal = () => {
        changepwref.current.openModal();

    };
    const closepwModal = () => {
        changepwref.current.closeModal();
    }

    const openChangeUsernameModal = () => {
        changeusernameref.current.openModal();
    }

    const closeChangeUsernameModal = () => {
        changeusernameref.current.closeModal();
    }

    const openFollowModal = () => {
        followRef.current.openModal();
    }

    const closeFollowModal = () => {
        followRef.current.closeModal();
    }

    const navigateCurrURL = () => {
        navigate(location.pathname);
    }


    return (
        <>
            {/*  Loading component */}
            {reload === 0 && loading ? <p style={{ fontSize: "5rem", position: "absolute", top: "45%", left: "45%", zIndex: 5 }}>Loading...</p> :
                <div className="profileContainer" >
                    <ChangePw setReload={setFollowReload} handleClose={closepwModal} changePwRef={changepwref} user={user} />
                    <Changeuname setReload={setFollowReload} handleClose={closeChangeUsernameModal} changeUnameRef={changeusernameref} />
                    {ownprofile && <Follow reload={followReload} handleClose={closeFollowModal} followRef={followRef} />}
                    <div className="usercard" >
                        <div className="top">
                            <div className="user-Img-Name">
                                <div className="editable">
                                    {user?.avatar?.url
                                        ? <Link to={user?.avatar?.url} target="_blank">
                                            <img src={user?.avatar?.url ? user.avatar.url : noProfileImage} alt="profile avatar" />
                                        </Link>
                                        : <img src={noProfileImage} alt="no profile image" />
                                    }
                                    {ownprofile &&
                                        <div onClick={triggerFileInput} className="editicon">
                                            <FaPencil />
                                            <form encType="multipart/form-data">
                                                <input onChange={(e) => handleEditAvatar(e)} ref={editavatarref} type="file" style={{ display: "none" }} />
                                            </form>
                                        </div>
                                    }
                                </div>

                                <div className="namecontainer">
                                    <div className="name">
                                        {user?.username && <div className="username">
                                            @{user.username}
                                        </div>}
                                    </div>
                                    <div className="follow">
                                        <div className="follower">
                                            <div className="element">
                                                <span onClick={ownprofile ? openFollowModal : navigateCurrURL}>{user?.follower?.length}</span>
                                                <p>Followers</p>
                                            </div>
                                        </div>
                                        <div className="followings">
                                            <div className="element">

                                                <span onClick={ownprofile ? openFollowModal : navigateCurrURL}>{user?.following?.length}</span>
                                                <p>Followings</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {((user?.college || user?.name) && <div className="name-college">
                                {user?.name && <p>{user.name}</p>}
                                {user?.name && <p className="college">
                                    <FaGraduationCap />
                                    {user.college}
                                </p>}

                            </div>)}
                        </div>
                        {!ownprofile && (
                            <div className="followbtn">
                                <button className={`${(isFollowing || isRequested || sendfr) ? "isFollowing" : ""} btn`}
                                    onClick={(isRequested || sendfr) ? handleWithdrawFollowRequest : (isFollowing ? handleUnfollow : handleSendFollowRequest)}
                                >
                                    {(isRequested || sendfr) ? "Requested" : (isFollowing ? "Following" : "Follow")}
                                </button>
                            </div>
                        )}

                        {(isFollowing || ownprofile) && (
                            <div className="ratingsWrapper">
                                {user?.cf?.rating ?
                                    <div className="ratings">
                                        <span>
                                            <img src={codeforces} alt="codeforces logo" />
                                            CodeForces
                                        </span>
                                        <span>{user.cf.rating}</span>
                                    </div>
                                    : ""
                                }
                                {user?.lc?.rating ?
                                    <div className="ratings">
                                        <span>
                                            <img src={leetcode} alt="leetcode logo" />
                                            LeetCode
                                        </span>
                                        <span>{user.lc.rating}</span>
                                    </div>
                                    : ""
                                }
                                {user?.cc?.rating > 0 ?
                                    <div className="ratings">
                                        <span>
                                            <img src={codechef} alt="codechef" />
                                            CodeChef
                                        </span>
                                        <span>{user.cc.rating}</span>
                                    </div>
                                    : ""
                                }
                            </div>
                        )}

                        {(isFollowing || ownprofile) && (
                            <div className="social">
                                {user?.linkedin?.length > 0 &&
                                    <a href={user.linkedin} target="_blank" className="social-icon">
                                        {/* <img src={linkedin} alt="linkedin" /> */}
                                        <FaLinkedin className="icon" /> {(user.linkedin).substring((user.linkedin).lastIndexOf('/'))}
                                    </a>
                                }
                                {user?.github?.length > 0 &&
                                    <a href={user.github} target="_blank" className="social-icon">
                                        {/* <img src={github} alt="github" /> */}
                                        <FaGithub className="icon" />{(user.github).substring((user.github).lastIndexOf('/'))}
                                    </a>
                                }
                                {user?.twitter?.length > 0 &&
                                    <a href={user.twitter} target="_blank" className="social-icon">
                                        {/* <img src={twitter} alt="twitter--v1" /> */}
                                        <FaXTwitter className="icon" />{(user.twitter).substring((user.twitter).lastIndexOf('/'))}
                                    </a>
                                }
                            </div>
                        )}

                        {ownprofile && (
                            <div className="options">
                                <div onClick={openChangeUsernameModal} className="changeusername">
                                    <div>
                                        <FaUser /> Change username
                                    </div>
                                    <FaAngleRight />
                                </div>
                                <div onClick={openPwModal} className="changepw">
                                    <div>
                                        <FaKey /> {user.password ? "Change" : "Set"} password
                                    </div>
                                    <FaAngleRight />
                                </div>
                            </div>
                        )}
                    </div>
                    {ownprofile && (
                        <div className="formcontainer">
                            <form onSubmit={handleProfileSubmit}>
                                <p className="groupHeading">
                                    <div className="submitbutton">
                                        {edit ? (
                                            <div className="save">
                                                <button className="cancel" onClick={() => { setEdit(false) }} type="button" >
                                                    <div className="icon">
                                                        <FaBan />
                                                        Cancel
                                                    </div>
                                                </button>
                                                <button type="submit">
                                                    <div className="icon">
                                                        {isProfileSubmitting
                                                            ? <span className="submittingForm">
                                                                <ClipLoader
                                                                    loading={isProfileSubmitting}
                                                                    color="#ffffff"
                                                                    className="icon"
                                                                    size={16}
                                                                    speedMultiplier={1}
                                                                />
                                                                Saving...
                                                            </span>
                                                            : <>
                                                                <FaFloppyDisk />
                                                                Save
                                                            </>
                                                        }

                                                    </div>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setEdit(true) }} type="button" >
                                                <div className="icon">
                                                    <FaPenToSquare />
                                                    Edit
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                    User Details
                                </p>
                                <div className="fieldcontainer">
                                    <Labelinput edit={edit}
                                        icon={<FaIdCard />}
                                        name={"name"}
                                        label={"Name"}
                                        onChange={changeFormdata}
                                        value={formdata.name}
                                    />
                                    <Labelinput
                                        edit={edit}
                                        icon={<FaUser />}
                                        name={"username"}
                                        label={"Username"}
                                        value={formdata.username}
                                        disabled
                                    />
                                    <Labelinput
                                        edit={edit}
                                        icon={<FaEnvelope />}
                                        style={{ paddingRight: "1.5rem" }}
                                        name={"email"}
                                        label={"Email"}
                                        value={formdata.email}
                                        type="email"
                                        disabled
                                    />
                                    <Labelinput
                                        edit={edit}
                                        icon={<FaGraduationCap />}
                                        name={"college"}
                                        style={{ paddingRight: "1.5rem" }}
                                        onChange={changeFormdata}
                                        label={"College"}
                                        value={formdata.college}
                                    />
                                </div>
                                <p className="groupHeading">Usernames</p>
                                <div className="fieldcontainer">
                                    <Labelinput
                                        edit={edit}
                                        image={codeforces}
                                        name={"cf"}
                                        onChange={changeFormdata}
                                        label={"CodeForces"}
                                        value={formdata.cf}
                                    />
                                    <Labelinput
                                        edit={edit}
                                        image={leetcode}
                                        name={"lc"}
                                        onChange={changeFormdata}
                                        label={"LeetCode"}
                                        value={formdata.lc}
                                    />
                                    <Labelinput
                                        edit={edit}
                                        image={codechef}
                                        name={"cc"}
                                        onChange={changeFormdata}
                                        label={"CodeChef"}
                                        value={formdata.cc}
                                    />
                                </div>

                                <p className="groupHeading">Links</p>
                                <div className="fieldcontainer">
                                    <Labelinput
                                        edit={edit}
                                        image={linkedin}
                                        name={"linkedin"}
                                        onChange={changeFormdata}
                                        label={"LinkedIn"}
                                        style={{ paddingRight: "1.5rem" }}
                                        value={formdata?.linkedin}
                                    />
                                    <Labelinput
                                        edit={edit}
                                        image={github}
                                        name={"github"}
                                        onChange={changeFormdata}
                                        label={"GitHub"}
                                        style={{ paddingRight: "1.5rem" }}
                                        value={formdata.github}
                                    />
                                    <Labelinput
                                        edit={edit}
                                        image={twitter}
                                        name={"twitter"}
                                        onChange={changeFormdata}
                                        label={"Twitter"}
                                        style={{ paddingRight: "1.5rem" }}
                                        value={formdata.twitter}
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            }


        </>
    );
};

export default Profile;

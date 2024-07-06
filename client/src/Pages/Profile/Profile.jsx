import "./Profile.scss";
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import linkedin from "../../assets/linkedin.png";
import github from "../../assets/github.png";
import twitter from "../../assets/twitter.png";
import hashnode from "../../assets/hashnode.png";
import medium from "../../assets/medium.png";
import noProfileImage from "../../assets/noProfileImage.png"
import Labelinput from "./Labelinput";
import { useEffect, useRef, useState } from "react";
import { FaBan } from "react-icons/fa";
import { FaAngleRight, FaCheck, FaEnvelope, FaFloppyDisk, FaGithub, FaGraduationCap, FaHashnode, FaIdCard, FaKey, FaLinkedin, FaMedium, FaPencil, FaPenToSquare, FaPlus, FaUser, FaXTwitter } from "react-icons/fa6";
import ChangePw from "./ChangePw";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import usePostFetch from "../../hooks/usePostFetch";
import { setAuth } from "../../redux/authReducer";



const Profile = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const current_user = useSelector(state => state.auth.auth)
    // console.log(current_user);
    const { data, loading, error } = useFetch(`/profile/${username}`);

    const user = data.user;
    // console.log(user);

    // console.log(current_user);
    // const ownprofile=current_user?._id?.toString()===user?._id?.toString() || false;
    const ownprofile = true;

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
        if (data) {
            setFormData({
                name: current_user?.name || '',
                username: current_user?.username,
                email: current_user?.email,
                college: current_user?.college || '',
                lc: current_user?.lc?.username || '',
                cf: current_user?.cf?.username || '',
                cc: current_user?.cc?.username || '',
                linkedin: current_user?.linkedin || '',
                github: user?.github || '',
                twitter: current_user?.twitter || '',
                hashnode: current_user?.hashnode || '',
                medium: current_user?.medium || '',
            })
        }
    }, [current_user])

    const [edit, setEdit] = useState(false);
    const [isFollowing, setisFollowing] = useState(false);
    const changepwref = useRef();
    const editavatarref = useRef();

    const changeFormdata = (field, value) => {

        setFormData((prev) => {
            return {
                ...prev,
                [field]: value
            }
        })
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setEdit(false);

        const data = await usePostFetch('/update-profile', formdata);

        if (data.data && data.data.user) {
            // toast.success(`Welcome back, ${data.data.user.name}`, {
            //     position: toast.POSITION.TOP_LEFT
            // });
            dispatch(setAuth(data.data.user));
        }
        else if (data.data) {
            // toast.warn(data.data.error || data.data.message, {
            //     position: toast.POSITION.TOP_LEFT
            // });
        }
        else {
            console.log(data);
            // toast.error(data.error, {
            //     position: toast.POSITION.TOP_LEFT
            // });
        }
    }



    const triggerFileInput = () => {
        editavatarref.current.click();
    }
    const handleEditAvatar = () => {
        console.log("hello");
    }

    const openPwModal = () => {
        changepwref.current.openModal();
    };



    return (
        <>
            <div className="profileContainer" >
                <ChangePw changePwRef={changepwref} />
                <div className="usercard" >
                    <div className="top">
                        <div className="editable">
                            <Link to={user?.avatar?.url}>
                                <img src={user?.avatar?.url ? user.avatar.url : noProfileImage} alt="profile avatar" />
                            </Link>
                            <div onClick={triggerFileInput} className="editicon">
                                <FaPencil />
                            </div>
                            <form encType="multipart/form-data">
                                <input onChange={handleEditAvatar} ref={editavatarref} type="file" style={{ display: "none" }} />
                            </form>
                        </div>

                        <div className="namecontainer">
                            <div className="name">
                                {formdata?.name && <p>{formdata.name}</p>}
                                <div className="username">
                                    @{formdata?.username && formdata.username}
                                </div>
                            </div>
                            {(formdata?.college && <div className="college">
                                <FaGraduationCap />
                                {formdata.college}
                            </div>)}
                        </div>
                    </div>

                    <div className="follow">
                        <div className="follower">
                            <a href="">
                                <span>{user?.follower?.length}</span>
                                <p>Followers</p>
                            </a>
                        </div>
                        <div className="followings">
                            <a href="">
                                <span>{user?.following?.length}</span>
                                <p>Followings</p>
                            </a>
                        </div>
                    </div>

                    {!ownprofile && (
                        <div className="followbtn">
                            <button className={`${isFollowing ? "isFollowing" : ""} btn`}
                                onClick={() => { setisFollowing((prev) => !prev); }}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                        </div>
                    )}

                    {(isFollowing || ownprofile) && (
                        <div className="ratingsWrapper">
                            {user?.cf?.rating &&
                                <div className="ratings">
                                    <span>
                                        <img src={codeforces} alt="codeforces logo" />
                                        {user.cf.rating} ({user.cf.maxRating})
                                    </span>
                                </div>
                            }
                            {user?.lc?.rating &&
                                <div className="ratings">
                                    <span>
                                        <img src={leetcode} alt="leetcode logo" />
                                        {user.lc.rating}
                                    </span>
                                </div>
                            }
                            {user?.cc?.rating &&
                                <div className="ratings">
                                    <span>
                                        <img src={codechef} alt="codechef" />
                                        {user.cc.rating} ({user.cc.maxRating})
                                    </span>
                                </div>
                            }
                        </div>
                    )}

                    {(isFollowing || ownprofile) && (
                        <div className="social">
                            {formdata.linkedin?.length > 0 &&
                                <a href={formdata.linkedin} className="social-icon">
                                    {/* <img src={linkedin} alt="linkedin" /> */}
                                    <FaLinkedin className="icon" /> {formdata.linkedin}
                                </a>
                            }
                            {formdata.twitter?.length > 0 &&
                                <a href={formdata.twitter} className="social-icon">
                                    {/* <img src={twitter} alt="twitter--v1" /> */}
                                    <FaXTwitter className="icon" />{formdata.twitter}
                                </a>
                            }
                            {formdata.github?.length > 0 &&
                                <a href={formdata.github} className="social-icon">
                                    {/* <img src={github} alt="github" /> */}
                                    <FaGithub className="icon" />{formdata.github}
                                </a>
                            }
                            {formdata.hashnode?.length > 0 &&
                                <a href={formdata.hashnode} className="social-icon">
                                    {/* <img src={hashnode} alt="hashnode" /> */}
                                    <FaHashnode className="icon" />{formdata.hashnode}
                                </a>
                            }
                            {formdata.medium?.length > 0 &&
                                <a href={formdata.medium} className="social-icon">
                                    {/* <img src={medium} alt="medium-logo" /> */}
                                    <FaMedium className="icon" />{formdata.medium}
                                </a>
                            }
                        </div>
                    )}

                    {ownprofile && (
                        <div className="options">
                            <div onClick={openPwModal} className="changepw">
                                <div>
                                    <FaKey /> Change password
                                </div>
                                <FaAngleRight />
                            </div>
                        </div>
                    )}
                </div>
                {ownprofile && (
                    <div className="formcontainer">
                        <form onSubmit={handleProfileSubmit}>
                            <div className="fieldcontainer">
                                <Labelinput
                                    edit={edit}
                                    icon={<FaIdCard />}
                                    name={"name"}
                                    onChange={changeFormdata}
                                    value={formdata.name}
                                />
                                <Labelinput
                                    edit={edit}
                                    icon={<FaUser />}
                                    name={"username"}
                                    value={formdata.username}
                                    disabled
                                />
                                <Labelinput
                                    edit={edit}
                                    icon={<FaEnvelope />}
                                    style={{ paddingRight: "1.5rem" }}
                                    name={"email"}
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
                                    label={"university"}
                                    value={formdata.college}
                                />
                                <Labelinput
                                    edit={edit}
                                    image={leetcode}
                                    name={"lc"}
                                    onChange={changeFormdata}
                                    label={"leetcode username"}
                                    value={formdata.lc}
                                />

                                <Labelinput
                                    edit={edit}
                                    image={codeforces}
                                    name={"cf"}
                                    onChange={changeFormdata}
                                    label={"codeforces username"}
                                    value={formdata.cf}
                                />

                                <Labelinput
                                    edit={edit}
                                    image={codechef}
                                    name={"cc"}
                                    onChange={changeFormdata}
                                    label={"codechef username"}
                                    value={formdata.cc}
                                />

                                <Labelinput
                                    edit={edit}
                                    image={linkedin}
                                    name={"linkedin"}
                                    onChange={changeFormdata}
                                    label={"linkedin url"}
                                    style={{ paddingRight: "1.5rem" }}
                                    value={formdata.linkedin}
                                />
                                <Labelinput
                                    edit={edit}
                                    image={github}
                                    name={"github"}
                                    onChange={changeFormdata}
                                    label={"github url"}
                                    style={{ paddingRight: "1.5rem" }}
                                    value={formdata.github}
                                />
                                <Labelinput
                                    edit={edit}
                                    image={twitter}
                                    name={"twitter"}
                                    onChange={changeFormdata}
                                    label={"twitter url"}
                                    style={{ paddingRight: "1.5rem" }}
                                    value={formdata.twitter}
                                />
                                <Labelinput
                                    edit={edit}
                                    image={hashnode}
                                    label={"hashnode url"}
                                    style={{ paddingRight: "1.5rem" }}
                                    value={formdata.hashnode}
                                />
                                <Labelinput
                                    edit={edit}
                                    image={medium}
                                    name={"medium"}
                                    onChange={changeFormdata}
                                    label={"medium url"}
                                    style={{ paddingRight: "1.5rem" }}
                                    value={formdata.medium}
                                />
                            </div>
                            <div className="submitbutton">
                                {edit ? (
                                    <div className="save">
                                        <button
                                            className="cancel"
                                            onClick={() => {
                                                setEdit(false);
                                            }}
                                            type="button"
                                        >
                                            <div className="icon">
                                                <FaBan />
                                                Cancel
                                            </div>
                                        </button>
                                        <button type="submit">
                                            <div className="icon">
                                                <FaFloppyDisk />
                                                Save
                                            </div>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEdit(true);
                                        }}
                                        type="button"
                                    >
                                        <div className="icon">
                                            <FaPenToSquare />
                                            Edit
                                        </div>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;

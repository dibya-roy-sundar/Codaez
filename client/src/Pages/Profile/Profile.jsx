import "./Profile.scss";
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import linkedin from "../../assets/linkedin.png";
import github from "../../assets/github.png";
import twitter from "../../assets/twitter.png";
import hashnode from "../../assets/hashnode.png";
import medium from "../../assets/medium.png";
import blankAvatar from "../../assets/noProfileImage.png"
import Labelinput from "./Labelinput";
import { useEffect, useRef, useState } from "react";
import { FaBan } from "react-icons/fa";
import { FaAngleRight, FaCheck, FaEnvelope, FaFloppyDisk, FaGraduationCap, FaIdCard, FaKey, FaPencil, FaPenToSquare, FaPlus, FaUser } from "react-icons/fa6";
import ChangePw from "./ChangePw";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import usePostFetch from "../../hooks/usePostFetch";
import { setAuth } from "../../redux/authReducer";



const Profile = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const current_user = useSelector(state => state.auth.auth.auth)
    console.log(current_user);
    const { data, loading, error } = useFetch(`/profile/${username}`, username.length > 0);

    const user = data.user;
    console.log(user);





    // console.log(current_user);
    // const ownprofile=current_user?._id?.toString()===user?._id?.toString() || false;
    const ownprofile = true;

    const defaultValues = {
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

    }
    const [formdata, setFormData] = useState(defaultValues);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user?.name || '',
                username: user?.username,
                email: user?.email,
                college: user?.college || '',
                lc: user?.lc?.username || '',
                cf: user?.cf?.username || '',
                cc: user?.cc?.username || '',
                linkedin: user?.linkedin || '',
                github: user?.github || '',
                twitter: user?.twitter || '',
                hashnode: user?.hashnode || '',
                medium: user?.medium || '',
            })
        }
    }, [user])

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
    const [fetchPostTrigger, setFetchPostTrigger] = useState(false);

    usePostFetch("/update-profile", formdata, fetchPostTrigger)
        .then((res) => {
            if (res && res.data && res.data.user) {

                dispatch(setAuth({ auth: res.data.user }))
            }
        })


    const handleProfileEdit = (e) => {
        e.preventDefault();
        console.log(formdata);
        setEdit(false);
        setFetchPostTrigger(true);

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
            <div
                style={
                    !ownprofile
                        ? {
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            paddingTop: "0.5rem",
                        }
                        : {}
                }
                className="profileContainer"
            >
                <ChangePw changePwRef={changepwref} />
                <div
                    style={!ownprofile ? { maxWidth: "600px" } : {}}
                    className="avatarcontainer"
                >
                    <div className="avatar">
                        <div className="editable">
                            <Link to={user?.avatar?.url}>
                                <img src={user?.avatar?.url ? user.avatar.url : blankAvatar} alt="profile avatar" />
                            </Link>
                            <div onClick={triggerFileInput} style={user?.college ? { bottom: "35%" } : {}} className="editicon">
                                <FaPencil />
                            </div>
                            <form encType="multipart/form-data">
                                <input onChange={handleEditAvatar} ref={editavatarref} type="file" style={{ display: "none" }} />
                            </form>
                        </div>
                        <div className="namecontainer">
                            <div style={!user?.name ? { justifyContent: "center" } : {}} className="name">
                                {formdata?.name && <p>{formdata.name}</p>}
                                <div className="username">
                                    <Link className="usernamelink" to={`/profile/${formdata?.username}`}>
                                        @{formdata?.username && formdata.username}
                                    </Link>
                                </div>
                            </div>

                            {(formdata?.college && <div className="college">
                                <FaGraduationCap />
                                <p>{formdata.college}</p>
                            </div>)}


                        </div>
                    </div>
                    <div className="follow">
                        <div className="follower">
                            <a href="">{user?.follower?.length}</a>
                            <p>followers</p>
                        </div>
                        <div className="followings">
                            <a href="">{user?.following?.length}</a>
                            <p>followings</p>
                        </div>
                    </div>
                    {!ownprofile && (
                        <div className="followbtn">
                            <button
                                style={
                                    isFollowing
                                        ? { background: "#473a69", border: "2px solid #703BF7" }
                                        : {}
                                }
                                className="btn"
                                onClick={() => {
                                    setisFollowing((prev) => !prev);
                                }}
                            >
                                {isFollowing ? <FaCheck /> : <FaPlus />}
                                <p>{isFollowing ? "Following" : "Follow"}</p>
                            </button>
                        </div>
                    )}

                    {(isFollowing || ownprofile) && (
                        <div className="codingdata">
                            <div className="data">
                                <img
                                    width="48"
                                    height="48"
                                    src={leetcode}
                                    alt="leetcode logo"
                                />
                                <p>{user?.lc?.rating.toString().substring(0, 4) || "- -"}</p>
                            </div>
                            <div className="data">
                                <img
                                    width="48"
                                    height="48"
                                    src={codeforces}
                                    alt="codeforces logo"
                                />
                                <p>{user?.cf?.rating ? `${user.cf.rating} (max: ${user.cf.maxRating})` : "- -"}</p>
                            </div>
                            <div className="data">
                                <img width="48" height="48" src={codechef} alt="codechef" />
                                <p>{user?.cc?.rating ? `${user.cc.rating} (max: ${user.cc.maxRating})` : "- -"}</p>
                            </div>
                        </div>
                    )}

                    {(isFollowing || ownprofile) && (
                        <div className="social">
                            <a href={formdata.linkedin?.length > 0 ? formdata.linkedin : "https://www.linkedin.com"} className="social-icon">
                                <img
                                    width="48"
                                    height="48"
                                    src={linkedin}
                                    alt="linkedin"
                                />
                            </a>
                            <a href={formdata.twitter?.length > 0 ? formdata.twitter : "https://www.twitter.com"} className="social-icon">
                                <img
                                    width="48"
                                    height="48"
                                    src={twitter}
                                    alt="twitter--v1"
                                />
                            </a>
                            <a href={formdata.github?.length > 0 ? formdata.github : "https://www.github.com"} className="social-icon">
                                <img
                                    width="48"
                                    height="48"
                                    src={github}
                                    alt="github"
                                />
                            </a>
                            <a href={formdata.hashnode?.length > 0 ? formdata.hashnode : "https://www.hashnode.com"} className="social-icon">
                                <img
                                    width="48"
                                    height="48"
                                    src={hashnode}
                                    alt="hashnode"
                                />
                            </a>
                            <a href={formdata.medium?.length > 0 ? formdata.medium : "https://www.medium.com"} className="social-icon">
                                <img
                                    width="48"
                                    height="48"
                                    src={medium}
                                    alt="medium-logo"
                                />
                            </a>
                        </div>
                    )}

                    {ownprofile && (
                        <div className="options">
                            <hr />
                            <div onClick={openPwModal} className="changepw">
                                <div>
                                    <FaKey />
                                    <p>Change password</p>
                                </div>
                                <FaAngleRight />
                            </div>
                        </div>
                    )}
                </div>
                {ownprofile && (
                    <div className="formcontainer">
                        <form onSubmit={handleProfileEdit}>
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

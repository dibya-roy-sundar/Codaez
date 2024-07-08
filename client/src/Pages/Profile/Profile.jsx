/* eslint-disable react-hooks/rules-of-hooks */
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
import { FaAngleRight, FaEnvelope, FaFloppyDisk, FaGithub, FaGraduationCap, FaHashnode, FaIdCard, FaKey, FaLinkedin, FaMedium, FaPencil, FaPenToSquare, FaUser, FaXTwitter } from "react-icons/fa6";
import ChangePw from "./ChangePw";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import usePutHook from "../../hooks/usePutHook";
import { setAuth, updateProfile } from "../../redux/authReducer";
import usePostFetch from "../../hooks/usePostFetch";



const Profile = () => {
    const dispatch = useDispatch();
    const current_user = useSelector(state => state.auth.auth)
    const [reload,setReload]=useState(0);

    const { username } = useParams();
    const ownprofile = current_user?.username === username;

    const { data, loading, error } = useFetch(`/profile/${username}`, !ownprofile,reload);
    
  

    useEffect(()=>{
        if(ownprofile){
            dispatch(updateProfile(current_user?.username));//only for showing updates on following 
            // othwerwise follow updated when user accept follow request
        }

    },[ownprofile])


    let user,isFollowing,isRequested;
    if (ownprofile) {
        
        user = current_user
    }
    else {
        user = data.user;
        isFollowing=data.isfollowing;
        isRequested=data.isrequested;

    }
    

    // const ownprofile = true;

    const [edit, setEdit] = useState(false);
    const changepwref = useRef();
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

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setEdit(false);

        const data = await usePutHook('/update-profile', formdata);

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

    const handleSendFollowRequest=async ()=>{
        const {data}=await usePostFetch('/sendfrequest',{username});

        if(data && data.success){
            // console.log(data);
            setReload(prev => prev+1);
        }else{
            console.log("error");
        }

    }

    const handleWithdrawFollowRequest=async () =>{
        const  {data}= await usePostFetch('/withdraw-request',{username});
        if(data && data.success){
            // console.log(data.msg); toastify
            setReload(prev => prev+1);
        }
    }
    const handleUnfollow=async () =>{
        const  {data}= await usePostFetch('/unfollow',{username});

        if(data && data.success){
            setReload(prev => prev+1);
            dispatch(setAuth(data.curr_user));
        }

    }

    const openPwModal = () => {
        changepwref.current.openModal();

    };
    const closepwModal= () => {
        changepwref.current.closeModal();
    }


    return (
        <>
            {/*  Loading component */}
            {reload===0 && loading ? <p style={{fontSize:"5rem",position:"absolute",top:"45%",left:"45%",zIndex:5}}>Loading...</p>:
                <div className="profileContainer" >
                <ChangePw handleClose={closepwModal} changePwRef={changepwref} />
                <div className="usercard" >
                    <div className="top">
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
                        </div>
                    </div>

                    {((user?.college || user?.name) && <div className="name-college">
                        {user?.name && <p>{user.name}</p>}
                        {user?.name && <p className="college">
                            <FaGraduationCap />
                            {user.college}
                        </p>}

                    </div>)}
                    {!ownprofile && (
                        <div className="followbtn">
                            <button  className={`${(isFollowing || isRequested ) ? "isFollowing" : ""} btn`}
                                onClick={isRequested ?  handleWithdrawFollowRequest : (isFollowing ? handleUnfollow  : handleSendFollowRequest) }
                            >
                                {isRequested ? "Requested" :( isFollowing  ? "Following" :"Follow")}
                            </button>
                        </div>
                    )}

                    {(isFollowing || ownprofile) && (
                        <div className="ratingsWrapper">
                            {user?.cf?.rating ?
                                <div className="ratings">
                                    <span>
                                        <img src={codeforces} alt="codeforces logo" />
                                        {user.cf.rating} ({user.cf.maxRating})
                                    </span>
                                </div>
                                : ""
                            }
                            {user?.lc?.rating ?
                                <div className="ratings">
                                    <span>
                                        <img src={leetcode} alt="leetcode logo" />
                                        {user.lc.rating}
                                    </span>
                                </div>
                                : ""
                            }
                            {user?.cc?.rating ?
                                <div className="ratings">
                                    <span>
                                        <img src={codechef} alt="codechef" />
                                        {user.cc.rating} ({user.cc.maxRating})
                                    </span>
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
                                    <FaLinkedin className="icon" /> {user.linkedin}
                                </a>
                            }
                            {user?.github?.length > 0 &&
                                <a href={user.github} target="_blank" className="social-icon">
                                    {/* <img src={github} alt="github" /> */}
                                    <FaGithub className="icon" />{user.github}
                                </a>
                            }
                            {user?.twitter?.length > 0 &&
                                <a href={user.twitter} target="_blank" className="social-icon">
                                    {/* <img src={twitter} alt="twitter--v1" /> */}
                                    <FaXTwitter className="icon" />{user.twitter}
                                </a>
                            }
                            {user?.hashnode?.length > 0 &&
                                <a href={user.hashnode} target="_blank" className="social-icon">
                                    {/* <img src={hashnode} alt="hashnode" /> */}
                                    <FaHashnode className="icon" />{user.hashnode}
                                </a>
                            }
                            {user?.medium?.length > 0 &&
                                <a href={user.medium} target="_blank" className="social-icon">
                                    {/* <img src={medium} alt="medium-logo" /> */}
                                    <FaMedium className="icon" />{user.medium}
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
                            <p className="groupHeading">User Details</p>
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
                                <Labelinput
                                    edit={edit}
                                    image={hashnode}
                                    name={"hashnode"}
                                    onChange={changeFormdata}
                                    label={"Hashnode"}
                                    style={{ paddingRight: "1.5rem" }}
                                    value={formdata.hashnode}
                                />
                                <Labelinput
                                    edit={edit}
                                    image={medium}
                                    name={"medium"}
                                    onChange={changeFormdata}
                                    label={"Medium"}
                                    style={{ paddingRight: "1.5rem" }}
                                    value={formdata.medium}
                                />
                            </div>
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
                                                <FaFloppyDisk />
                                                Save
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
                        </form>
                    </div>
                )}
                </div>
            }
                
           
        </>
    );
};

export default Profile;

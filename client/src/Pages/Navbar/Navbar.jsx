import "./Navbar.scss";
import leetcode from "../../assets/leetcode.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { FaUserFriends } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import noprofileimage from "../../assets/noProfileImage.png"
import { useDispatch, useSelector } from "react-redux";
import usePostFetch from "../../hooks/usePostFetch";
import { setAuth } from "../../redux/authReducer";

let searchData=[]

const Navbar = () => {
    const [value, setValue] = useState("");
    const [openOptions, setOpenoptions] = useState(false);
    const [openFr,setopenFr]=useState(false);
    const [inputvalue,setinputvalue]=useState("");
    const inputref=useRef();
    const friendref=useRef();
    const user=useSelector(state => state.auth.auth);
    const dispatch=useDispatch()

    const {data,loading,error}=useFetch(`/userdetails?keyword=${inputvalue}`, inputvalue.length>0)
    if(data){
        searchData=data.users;
    }

   const handleacceptFrequest=async (reqId)=>{
   const res=await usePostFetch('/acceptfrequest',{reqId})

   if(res && res.data && res.data.curr_user) {
    console.log("hello");
    dispatch(setAuth({...res.data.curr_user}))
}
}

const handlerejectFrequest=async (reqId)=>{
    const res=await usePostFetch('/rejectfrequest',{reqId})

    if(res && res.data && res.data.curr_user) {
        console.log("hello");
        dispatch(setAuth(res.data.curr_user))
    }
}


  

    

    useEffect(()=>{
        const timer=setTimeout( ()=>{
        //    console.log(value);
           setinputvalue(value);
        },350)

        return ()=> clearTimeout(timer)
    },[value])

   
    const handleFocus = () => {
        setOpenoptions(true);
    }

    const handleFr=()=>{
        setopenFr((prev)=>!prev);
    }

    const handleBlur = () => {
        setOpenoptions(false);
        inputref.current.blur()
       
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
    }

    useEffect(()=>{

        document.addEventListener("click",(e)=>{
            if(friendref.current && !friendref.current.contains(e.target)){
                setopenFr(false);
            }
        })

    },[friendref])

   

    return (
        <>
            <div className="navbar">
                <div className="logo">
                    <Link to={"/"}>
                        <img alt="app logo" src={leetcode} />
                    </Link>
                </div>
                <div className="searchcontainer">
                    <div ref={friendref} className="request">
                        <FaUserFriends   onClick={handleFr}  className="icon" />
                        {openFr &&  <div className="frequest">
                            {user?.fRequests?.map((fr)=> {
                                return (
                                    <div key={fr.senderusername} className="individual">
                                            <div className="username">
                                                    <img src={fr.senderavatar?.url || noprofileimage} alt="user avatar" />
                                                <p>{fr.senderusername}</p>
                                            </div>
                                            <div className="options">

                                                <div onClick={() => {handleacceptFrequest(fr._id)}} className="accept">
                                                    <TiTick  className="icon" />
                                                </div>
                                                <div onClick={() => {handlerejectFrequest(fr._id)}} className="reject">
                                                    <RxCross2 className="icon" />
                                                </div>
                                            </div>
                                    </div>
                                )
                            })}
                        </div>}
                       
                    </div>

                <div className="search">

                    <input ref={inputref} onFocus={handleFocus} onBlur={handleBlur}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        placeholder="Search username..."
                    />
                    {openOptions && (
                        <div className="options" onMouseDown={handleMouseDown}>
                            {searchData?.length>0 &&  searchData.map((el) => {
                                return (
                                    <Link onClick={handleBlur} className="link" key={el.username} to={`/profile/${el.username}`}>
                                        <div className="individual">
                                            <img src={el.avatar?.url} alt={`${el.username} avatar`} />
                                            <p>{el.username}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;

import "./Navbar.scss";
import leetcode from "../../assets/leetcode.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { FaUserFriends } from "react-icons/fa";
import RequestBox from "./RequestBox";

let searchData=[]

const Navbar = () => {
    const [value, setValue] = useState("");
    const [openOptions, setOpenoptions] = useState(false);
    const [openFr,setopenFr]=useState(false);
    const [inputvalue,setinputvalue]=useState("");
    const inputref=useRef();
    const friendref=useRef();
   

    const {data,error}=useFetch(`/userdetails?keyword=${inputvalue}`, inputvalue.length>0)
    if(data){
        searchData=data.users;
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
                        {/* {openFr &&  <div className="frequest">
                            {loading && <p>Loading...</p>}
                            {fr.length===0 && <p>No pending requests</p>}
                            {fr?.map((f)=> {
                                return (
                                    <div key={f.senderusername} className="individual">
                                            <div className="username">
                                                    <img src={f.senderavatar?.url || noprofileimage} alt="user avatar" />
                                                <p>{f.senderusername}</p>
                                            </div>
                                            <div className="options">

                                                <div onClick={() => {handleacceptFrequest(f._id)}} className="accept">
                                                    <TiTick  className="icon" />
                                                </div>
                                                <div onClick={() => {handlerejectFrequest(f._id)}} className="reject">
                                                    <RxCross2 className="icon" />
                                                </div>
                                            </div>
                                    </div>
                                )
                            })}
                        </div>} */}
                     { openFr &&    <RequestBox  />}
                       
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

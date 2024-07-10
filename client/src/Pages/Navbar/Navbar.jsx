import "./Navbar.scss";
import leetcode from "../../assets/leetcode.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { RiUserFollowFill } from "react-icons/ri";
import RequestBox from "./RequestBox";
import noProfileImage from '../../assets/noProfileImage.png'

const Navbar = () => {
    const [value, setValue] = useState("");
    const [openSearchResults, setOpenSearchResults] = useState(false);
    const [openFr, setopenFr] = useState(false);
    const [inputvalue, setinputvalue] = useState("");
    const inputref = useRef();
    const friendref = useRef();


    const { data, loading, error } = useFetch(`/userdetails?keyword=${inputvalue}`, inputvalue.length > 0)

    useEffect(() => {
        const timer = setTimeout(() => {
            //    console.log(value);
            setinputvalue(value);
        }, 350)

        return () => clearTimeout(timer)
    }, [value])


    const handleFocus = () => {
        setOpenSearchResults(true);
    }

    const handleBlur = () => {
        setOpenSearchResults(false);
        inputref.current.blur()
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
    }

    const handleFr = () => {
        setopenFr((prev) => !prev);
    }

    useEffect(() => {

        document.addEventListener("click", (e) => {
            if (friendref.current && !friendref.current.contains(e.target)) {
                setopenFr(false);
            }
        })

    }, [friendref])



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
                        <RiUserFollowFill onClick={handleFr} className="icon" />
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
                        {openFr && <RequestBox />}
                    </div>

                    <div className="search">

                        <input ref={inputref} onFocus={handleFocus} onBlur={handleBlur}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            placeholder="Search username..."
                        />
                        {openSearchResults && (
                            <div className="options" onMouseDown={handleMouseDown}>
                                {data?.users?.length > 0
                                    ? data.users.map((el) => {
                                        return (
                                            <Link onClick={handleBlur} className="user" key={el.username} to={`/profile/${el.username}`}>
                                                <div>
                                                    <img src={el.avatar?.url || noProfileImage} alt="user avatar" />
                                                </div>
                                                <div className='userdetails'>
                                                    <span className='username'>@{el.username}</span>
                                                    <span>Vanshul</span>
                                                </div>
                                            </Link>
                                        );
                                    })
                                    : <p className="noResults">No Results to show</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;

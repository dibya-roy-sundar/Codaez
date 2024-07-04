import "./Navbar.scss";
import leetcode from "../../assets/leetcode.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";


let searchData=[]

const Navbar = () => {
    const [value, setValue] = useState("");
    const [openOptions, setOpenoptions] = useState(false);
    const [inputvalue,setinputvalue]=useState("");
    const inputref=useRef()

    const {data,loading,error}=useFetch(`/userdetails?keyword=${inputvalue}`)
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

    const handleBlur = () => {
        setOpenoptions(false);
        inputref.current.blur()
       
    }


    const handleMouseDown = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div className="navbar">
                <div className="logo">
                    <Link to={"/"}>
                        <img alt="app logo" src={leetcode} />
                    </Link>
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
                                    <Link onClick={handleBlur} className="link" key={el.username} to={"/profile"}>
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
        </>
    );
};

export default Navbar;

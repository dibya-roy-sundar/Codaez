import "./Navbar.scss";
import leetcode from "../../assets/leetcode.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [value, setValue] = useState(null);
    const [openOptions, setOpenoptions] = useState(false);

    const data = [
        {
            avatar: leetcode,
            username: "dibya roy",
        },
        {
            avatar: leetcode,
            username: "dibya",
        },
        {
            avatar: leetcode,
            username: "dibya",
        },
        {
            avatar: leetcode,
            username: "dibya",
        },
        {
            avatar: leetcode,
            username: "dibya",
        },
        {
            avatar: leetcode,
            username: "dibya",
        },
        {
            avatar: leetcode,
            username: "dibya",
        },
        {
            avatar: leetcode,
            username: "dibya",
        },
    ];

    const handleFocus = () => {
        setOpenoptions(true);
    }

    const handleBlur = () => {
        setOpenoptions(false);
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
                    <input onFocus={handleFocus} onBlur={handleBlur}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        placeholder="Search username..."
                    />
                    {openOptions && (
                        <div className="options" onMouseDown={handleMouseDown}>
                            {data.map((el) => {
                                return (
                                    <Link onClick={handleBlur} className="link" key={el.username} to={"/profile"}>
                                        <div className="individual">
                                            <img src={el.avatar} alt={`${el.username} avatar`} />
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

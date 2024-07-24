import { useEffect, useRef, useState } from 'react';
import './CompleteProfile.scss';
// import { FaGoogle } from 'react-icons/fa';
// import OTPVerification from './OtpVerification';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import codeforces from '../../assets/codeforces.png';
import leetcode from '../../assets/leetcode.png';
import codechef from '../../assets/codechef.png';
import { setAuth } from '../../redux/authReducer';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import usePutHook from '../../hooks/usePutHook';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { SiTicktick } from "react-icons/si";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Cookies from 'js-cookie';


const CompleteProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const avatarref = useRef();

    const [searchParams, setSearchParams] = useSearchParams();
    const [InputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(null);
    const [unique, setUnique] = useState(null);
    const [isnormal, setisnormal] = useState(false);

    const userFromRedux = useSelector(state => state.auth.auth)
    const [currentStep, setCurrentStep] = useState(1);
    const [profilePicture, setProfilePicture] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [formValues, setFormValues] = useState({
        username: '',
        firstName: '',
        lastName: '',
        college: '',
        leetcode: '',
        codeforces: '',
        codechef: ''
    });


    const [user, setUser] = useState();
    const [isFormSubmitting, setisFormSubmitting] = useState(false);


    useEffect(() => {
        if (searchParams.get('email') && searchParams.get('token')) {
            Cookies.set('token', searchParams.get('token'), {
                ...searchParams.get('cookieOptions'),
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            setUser({
                email: searchParams.get('email'),
                name: searchParams.get('name'),
                avatarUrl: searchParams.get('avatarUrl'),
            });
            setProfilePicture(searchParams.get('avatarUrl'));
            const name = searchParams.get('name')?.split(' ');
            const lastname = name?.slice(1,)?.join(' ');
            setFormValues(prev => ({ ...prev, firstName: name[0], lastName: lastname }));
        }
        else {
            setUser(userFromRedux);
        }
    }, []);

    useEffect(() => {
        const changeuname = async () => {
            const { data } = await usePutHook("/change-username", {
                username: InputValue,
                save: false,
            });

            if (data) {
                setLoading(false);
                if (data.success) {
                    setUnique(true);
                    // unique username found
                    if (data.isnormal) {
                        setisnormal(true);
                    } else {
                        setisnormal(false);
                        toast.warn(" username must be 18 characters or fewer", {
                            position: "top-right"
                        });
                    }
                } else {
                    setUnique(false);
                    toast.warn(data.data.error || data.data.message, {
                        position: "top-right"
                    });
                    // username already taken - Toastify
                }
            }
        };

        if (InputValue.length > 0) {
            changeuname();
        }
    }, [InputValue]);




    useEffect(() => {
        const timer = setTimeout(() => {
            setInputValue(formValues.username.trim());
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [formValues.username]);


    const location = useLocation();
    const state = location.state || {};
    const gauth = searchParams.get('fromgauth');
    if (!state || Object.keys(state).length === 0) {
        if (!gauth) {
            return <Navigate to={"/"} replace />
        }
    } else {
        if (!state?.fromregister) {
            return <Navigate to={"/"} replace />
        }
    }






    const allset = !loading && unique && isnormal;


    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormSubmitting) return;
        setisFormSubmitting(true);

        const data = await usePutHook('/complete-profile', {
            username: formValues.username,
            name: formValues.firstName + " " + formValues.lastName,
            college: formValues.college,
            lc: formValues.leetcode,
            cf: formValues.codeforces,
            cc: formValues.codechef,
            avatar: avatar,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (data.data && data.data.user) {
            toast.success(`welcome to Codaez, ${data.data.user.name?.trim()?.length > 0 ? data.data.user.name : (data.data.user.username)}!`, {
                position: "top-right"
            });
            dispatch(setAuth(data.data.user));
            navigate('/dashboard');
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
        setisFormSubmitting(false);
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStepChange = (step) => {
        setCurrentStep(step);
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
        setLoading(true);
        if (formValues.username.trim() === value.trim()) {
            setLoading(false);
        }
    };



    return (
        <div className="register-container">
            <div className="register-content">
                <div className="progress-bar">
                    <div className='eachStep restricted' onClick={() => handleStepChange(1)}>
                        <div className={`progress-step ${currentStep > 1 ? 'completed' : currentStep == 1 ? 'active' : ''}`}>
                            {currentStep > 1 ? <FaCheck /> : '1'}
                        </div>
                        <p>User Credentails</p>
                    </div>
                    <div className='eachStep' >
                        <div className={`progress-step ${currentStep > 2 ? 'completed' : currentStep == 2 ? 'active' : ''}`}>
                            {currentStep > 2 ? <FaCheck /> : '2'}
                        </div>
                        <p>User Details</p>
                    </div>
                    <div className='eachStep' >
                        <div className={`progress-step ${currentStep > 3 ? 'completed' : currentStep == 3 ? 'active' : ''}`}>
                            {currentStep > 3 ? <FaCheck /> : '3'}
                        </div>
                        <p>Coding Usernames</p>
                    </div>
                </div>
                <div className="register-form">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="register-step">
                                <h3>User Credentails</h3>
                                {/* <div className="input-wrap">
                                    <input type="text" id="username" name="username" value={user.username} required />
                                </div> */}
                                <div className="input-wrap">
                                    <input type="text" id="username" name="username" value={formValues.username} placeholder='' onChange={handleInputChange} required />
                                    <label htmlFor="username">Username</label>
                                    {(formValues.username.length > 0) && (
                                        <div className="spinner">
                                            {loading ? (
                                                <ClipLoader
                                                    loading={loading}
                                                    color="#814fff"
                                                    className="icon"
                                                    size={18}
                                                    speedMultiplier={1}
                                                />
                                            ) : unique ? (
                                                <SiTicktick size={18} color="#814fff" />
                                            ) : (
                                                <RiErrorWarningLine size={18} color="#e9bc28" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="input-wrap">
                                    <input type="email" id="email" name="email" value={user?.email} disabled required />
                                </div>
                                {/* <div className="input-wrap">
                                    <input type="password" id="password" name="password" required />
                                    <label htmlFor="password">Password</label>
                                </div> */}
                                {/* <button type="button" className="register-button" onClick={handleNextStep}>
                                    Register
                                </button> */}
                                {/* <div className="google-button">
                                    <div className="google-btn-image">
                                        <FaGoogle />
                                    </div>
                                    <div>
                                        <span>Register with Google</span>
                                    </div>
                                </div> */}
                                <div className="register-buttons">
                                    <button disabled={!allset} type="button" className={`${allset ? " " : "disable "} register-button`} onClick={handleNextStep}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="register-step">
                                <h3>User Details</h3>
                                <div className="profile-input">
                                    <div className="profile-picture">
                                        {profilePicture ? (
                                            <img onClick={() => {
                                                setProfilePicture(null)
                                                avatarref.current.click()
                                            }} src={profilePicture} alt="profile image" />
                                        ) : (
                                            <div onClick={() => avatarref.current.click()} ></div>
                                        )}
                                        <input type="file" id="photo" ref={avatarref} name="photo" accept="image/*" onChange={(e) => handleProfilePictureChange(e)} />
                                    </div>
                                    <div className="name-fields">
                                        <div className="input-wrap">
                                            <input type="text" id="firstName" name="firstName" value={formValues.firstName} placeholder='' onChange={handleInputChange} />
                                            <label htmlFor="firstName">First Name</label>
                                        </div>
                                        <div className="input-wrap">
                                            <input type="text" id="lastName" name="lastName" value={formValues.lastName} placeholder='' onChange={handleInputChange} />
                                            <label htmlFor="lastName">Last Name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-wrap">
                                    <input type="text" id="college" name="college" value={formValues.college} placeholder='' onChange={handleInputChange} />
                                    <label htmlFor="college">College Name</label>
                                </div>
                                <div className="register-buttons">

                                    <button type="button" className="register-button" onClick={handlePrevStep}>
                                        <IoIosArrowBack />
                                        Back
                                    </button>
                                    <button type="button" className="register-button" onClick={handleNextStep}>
                                        Next
                                        <IoIosArrowForward />
                                    </button>
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="register-step">
                                <h3>Coding Usernames</h3>
                                <div className="codingLogoContainer">
                                    <div className='logo'>
                                        <img src={codeforces} alt="" />
                                    </div>
                                    <div className="input-wrap">
                                        <input type="text" id="codeforces" name="codeforces" value={formValues.codeforces} placeholder='' onChange={handleInputChange} />
                                        <label htmlFor="codeforces">Username</label>
                                    </div>
                                </div>
                                <div className="codingLogoContainer">
                                    <div className='logo'>
                                        <img src={leetcode} alt="" />
                                    </div>
                                    <div className="input-wrap">
                                        <input type="text" id="leetcode" name="leetcode" value={formValues.leetcode} placeholder='' onChange={handleInputChange} />
                                        <label htmlFor="leetcode">Username</label>
                                    </div>
                                </div>
                                <div className="codingLogoContainer">
                                    <div className='logo'>
                                        <img src={codechef} alt="" />
                                    </div>
                                    <div className="input-wrap">
                                        <input type="text" id="codechef" name="codechef" value={formValues.codechef} placeholder='' onChange={handleInputChange} />
                                        <label htmlFor="codechef">Username</label>
                                    </div>
                                </div>
                                <div className='register-buttons'>
                                    <button type="button" className="register-button" onClick={handlePrevStep}>
                                        <IoIosArrowBack />
                                        Back
                                    </button>
                                    <button disabled={isFormSubmitting} type="submit" className="register-button">
                                        {isFormSubmitting
                                            ?
                                            <><ClipLoader
                                                color="#ffffff"
                                                className="icon"
                                                size={18}
                                                speedMultiplier={1}
                                            /></>
                                            : "Submit"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;

import './Profile.scss';
import {faker} from "@faker-js/faker"
import leetcode from "../../assets/leetcode.png"
import codeforces from "../../assets/codeforces.png"
import codechef from "../../assets/codechef.png"
import Labelinput from './Labelinput';
import { useRef, useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faBan, faCheck, faChevronRight, faEnvelope, faFloppyDisk, faIdCard, faKey, faPenToSquare,  faPlus, faUser} from "@fortawesome/free-solid-svg-icons"
import ChangePw from './ChangePw';

const Profile = () => {
    const [edit,setEdit]=useState(false)
    const [isFollowing,setisFollowing]=useState(false);
    const changepwref=useRef();

    const openPwModal=()=>{
        changepwref.current.openModal()
    }

    return (
       <>
       <div className='profileContainer'>
            <ChangePw changePwRef={changepwref}/>
            <div className='avatarcontainer' >
                <div className='avatar'>
                    <img src={faker.image.avatar()} alt='profile avatar' />
                    <div className='name'>
                        <p>Dibya Sundar Roy</p>
                        <div className="username">
                            <a href='/profile'>
                                @dibya
                            </a>
                        </div>
                    </div>
                   
                </div>
                <div className="followbtn">
                    <button onClick={()=>{setisFollowing(prev =>!prev)}}>
                        <FontAwesomeIcon className='icon' icon={isFollowing?faCheck:faPlus} />
                        <p>{isFollowing?"Following":"Follow"}</p>
                    </button>
                </div>
                <div className="follow">
                    <div className="follower">
                        <a href=''>
                            10
                        </a>
                        <p>followers</p>
                    </div>
                    <div className="followings">
                         <a href=''>
                            10
                        </a>
                        <p>followings</p>
                    </div>
                </div>
                <div className="options">
                    <hr  />
                    <div className="changepw">
                        <div>
                            <FontAwesomeIcon icon={faKey} />
                            <p>Change password</p>
                        </div>
                        <FontAwesomeIcon onClick={openPwModal} className='icon' icon={faChevronRight} />
                    </div>
                </div>
            </div>
            <div className="formcontainer">
                    <form>
                        <div className="fieldcontainer">
                            <Labelinput edit={edit} icon={<FontAwesomeIcon icon={faIdCard} />}  name={"Name"} value={"Dibya"} />
                            <Labelinput edit={edit}  icon={<FontAwesomeIcon icon={faUser} />} name={"Username"} value={"inkover_19"} />
                            <Labelinput edit={edit} icon={<FontAwesomeIcon icon={faEnvelope} />}  name={"Email"} value={"dibya.roy.12345@gmail.com"} type="email" />
                            <Labelinput edit={edit} image={leetcode}  name={"Leetcode username"} value={"inkover_19"} />

                            <Labelinput edit={edit} image={codeforces}  name={"Codeforces username"} value={"inkover_19"} />

                            <Labelinput edit={edit} image={codechef}  name={"codechef username"} value={"inkover_19"} />


                        </div>
                        <div className="submitbutton">
                            {edit?
                            <div className="save">
                                <button className='cancel' onClick={()=>{setEdit(false)}} type='button'>
                                    <div className="icon">
                                    <FontAwesomeIcon style={{fontSize:"1.2rem"}} icon={faBan} />
                                     Cancel  
                                    </div>
                                    </button>
                                <button type='submit'>
                                    <div className="icon">
                                    <FontAwesomeIcon style={{fontSize:"1.2rem"}} icon={faFloppyDisk} />
                                    Save
                                    </div>
                                    </button>
                            </div>
                            :<button onClick={()=>{setEdit(true)}} type='button'>
                                <div className="icon">
                                <FontAwesomeIcon style={{fontSize:"1.2rem"}} icon={faPenToSquare} />
                                    Edit
                                </div>
                                </button>
                            }
                            
                            
                        </div>
                    </form>
            </div>
       </div>
       </>
    )
}

export default Profile;
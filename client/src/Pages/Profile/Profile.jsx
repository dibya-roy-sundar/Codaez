import './Profile.scss';
import {faker} from "@faker-js/faker"
import leetcode from "../../assets/leetcode.png"
import codeforces from "../../assets/codeforces.png"
import codechef from "../../assets/codechef.png"
import Labelinput from './Labelinput';
import { useRef, useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faBan, faCheck, faChevronRight, faEnvelope, faFloppyDisk, faGraduationCap, faIdCard, faKey, faPenToSquare,  faPlus, faUser} from "@fortawesome/free-solid-svg-icons"
import ChangePw from './ChangePw';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [edit,setEdit]=useState(false)
    const [isFollowing,setisFollowing]=useState(false);
    const [ownprofile,setownprofile]=useState(false);
    const changepwref=useRef();

    const openPwModal=()=>{
        changepwref.current.openModal()
    }

    return (
       <>
       <div style={!ownprofile ?  {display:"flex",justifyContent:"center",width:"100%",paddingTop:"0.5rem"}:{}} className='profileContainer'>
            <ChangePw changePwRef={changepwref}/>
            <div  style={!ownprofile ? {maxWidth:"600px"}:{}}  className='avatarcontainer' >
                <div className='avatar'>
                    <img src={faker.image.avatar()} alt='profile avatar' />
                    <div className='namecontainer'>
                        <div className="name">
                         <p>Dibya Sundar Roy</p>
                         <div className="username">
                            <a href='/profile'>
                                @dibya
                            </a>
                         </div>
                        </div>
                        <div className="college">
                            <FontAwesomeIcon icon={faGraduationCap} />
                            <p>Jaypee Institute of Information Technology</p>
                        </div>
                        
                    </div>
                   
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
                <div  className="followbtn">
                    <button style={isFollowing?{background:"#473a69",border:"2px solid #703BF7"}:{}} className='btn'  onClick={()=>{setisFollowing(prev =>!prev)}}>
                        <FontAwesomeIcon className='icon' icon={isFollowing?faCheck:faPlus} />
                        <p>{isFollowing?"Following":"Follow"}</p>
                    </button>
                </div>
                {isFollowing && <div className="codingdata">
                    <div className="data">
                        <img width="48" height="48" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png" alt="external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo"/>
                        <p>1635</p>
                    </div>
                    <div className="data">
                         <img width="48" height="48" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-color-tal-revivo.png" alt="external-codeforces-programming-competitions-and-contests-programming-community-logo-color-tal-revivo"/>                        <p>1635</p>
                    </div>
                    <div className="data">
                         <img width="48" height="48" src="https://img.icons8.com/fluency/48/codechef.png" alt="codechef"/>                        <p>1635</p>
                    </div>
                </div>}
                
                {isFollowing && <div className="social">
                    <Link to={"https://www.linkedin.com"} className='social-icon'>
                             <img width="48" height="48"  src="https://img.icons8.com/color/48/linkedin.png" alt="linkedin"/>
                    </Link>
                    <Link to={"https://www.twitter.com"} className='social-icon'>
                        <img width="48" height="48" src="https://img.icons8.com/color/48/twitter--v1.png" alt="twitter--v1"/>                    </Link>
                    <Link to={"https://www.github.com"} className='social-icon'>
                        <img width="48" height="48" src="https://img.icons8.com/ios-glyphs/30/github.png" alt="github"/>                    </Link>
                    <Link to={"https://www.hashnode.com"} className='social-icon'>
                        <img width="48" height="48" src="https://img.icons8.com/color/48/hashnode.png" alt="hashnode"/>                    </Link>
                    <Link to={"https://www.medium.com"} className='social-icon'>
                    <img width="48" height="48" src="https://img.icons8.com/ios/50/medium-logo.png" alt="medium-logo"/>                    </Link>
                </div>}
                

                {ownprofile && 
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
                }

               
            </div>
            {ownprofile && 
                <div  className="formcontainer">
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
            }
            
       </div>
       </>
    )
}

export default Profile;
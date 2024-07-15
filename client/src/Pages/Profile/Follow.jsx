/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useEffect, useState } from 'react'
import './Follow.scss'
import Modal from './Modal'
import { RxCrossCircled } from "react-icons/rx";
import useFetch from '../../hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../redux/authReducer';
import noProfileImage from '../../assets/noProfileImage.png'
import { Link } from 'react-router-dom';


const Follow =forwardRef( ({handleClose,followRef}) => {
    const [selected,setSelected]=useState(0);
    const user=useSelector(state => state.auth.auth);
    const dispatch=useDispatch()

    const { data, loading, error } = useFetch('/get-follow');

    useEffect(() => {
        if (data && data.success) {  
            dispatch(setAuth(data.user));
        }
    }, [data])

    

    

  return (
    <Modal ref={followRef}>
        <div className="followcontainer">
            <div className="close">
                <RxCrossCircled className='icon'  onClick={handleClose}/>
            </div>
            <div className="options">
                <div onClick={()=>{setSelected(0)}} className={`follower ${selected===0?"selected":""}`}>
                    <p>Followers(<span>{user?.follower?.length}</span>)</p>

                </div>
                <div onClick={()=>{setSelected(1)}} className={`followings ${selected===1?"selected":""}`}>
                     <p>Followings(<span>{user?.following?.length}</span>)</p>
                </div>
            </div>
                {selected===0 ?
                    <div className="followercontainer">
                        {user?.follower?.length > 0
                                    ? user?.follower?.map((el) => {
                                        return (
                                            <Link  className="user" key={el.username} to={`/profile/${el.username}`}>
                                                <div>
                                                    <img src={el.avatar?.url || noProfileImage} alt="user avatar" />
                                                </div>
                                                <div className='userdetails'>
                                                    <span className='username'>@{el.username}</span>
                                                    <span>{el.name}</span>
                                                </div>
                                            </Link>
                                        );
                                    })
                                    : <p className="noResults">No Followers</p>}
                    </div> :
                    <div className="followingcontainer">
                        {user?.following?.length > 0
                                    ? user?.following?.map((el) => {
                                        return (
                                            <Link className="user" key={el.username} to={`/profile/${el.username}`}>
                                                <div>
                                                    <img src={el.avatar?.url || noProfileImage} alt="user avatar" />
                                                </div>
                                                <div className='userdetails'>
                                                    <span className='username'>@{el.username}</span>
                                                    <span>{el.name}</span>
                                                </div>
                                            </Link>
                                        );
                                    })
                                    : <p className="noResults">No Followings</p>}
                    </div>
                }
                    
                    
            </div>
    </Modal>
  )
})

export default Follow

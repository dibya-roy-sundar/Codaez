/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useEffect, useState } from 'react'
import './Follow.scss'
import Modal from './Modal'
import useFetch from '../../hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../redux/authReducer';
import noProfileImage from '../../assets/noProfileImage.png'
import { Link } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';


const Follow = forwardRef(({ reload, handleClose, followRef, openFollow, setOpenFollow }) => {
    const user = useSelector(state => state.auth.auth);
    const dispatch = useDispatch()

    const { data, loading, error } = useFetch('/get-follow', true, reload);

    useEffect(() => {
        if (data && data.success) {
            dispatch(setAuth(data.user));
        }
    }, [data])

    return (
        <Modal ref={followRef}>
            <div className="followcontainer">
                <div className="close">
                    <IoMdClose className='icon' onClick={handleClose} />
                </div>
                <div className="heading">
                    <div onClick={() => { setOpenFollow(0) }} className={`follower ${openFollow === 0 ? "selected" : ""}`}>
                        Followers
                    </div>
                    <div onClick={() => { setOpenFollow(1) }} className={`followings ${openFollow === 1 ? "selected" : ""}`}>
                        Following
                    </div>
                </div>
                {openFollow === 0 ?
                    <div className="followercontainer">
                        {user?.follower?.length > 0
                            ? user?.follower?.map((el) => {
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
                            : <p className="noResults">No Following</p>}
                    </div>
                }
            </div>
        </Modal>
    )
})

export default Follow

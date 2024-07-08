import './RequestBox.scss'
import { TiTick } from "react-icons/ti";
import noprofileimage from "../../assets/noProfileImage.png"
import { RxCross2 } from "react-icons/rx";
import { useDispatch,  } from 'react-redux';
import {  useState } from 'react';
import { setAuth } from '../../redux/authReducer';
import useFetch from '../../hooks/useFetch';
import usePostFetch from '../../hooks/usePostFetch';


const RequestBox = () => {
    const [reload,setReload]=useState(false);
    const dispatch=useDispatch()

    const {data}=useFetch('/get-requests',true,reload);
    let fr=[];
    if(data && data.status){
        fr=data.frequests;
    }
    

   

    const handleacceptFrequest=async  (reqId)=>{
        const {data}=await usePostFetch('/acceptfrequest',{reqId})

        if(data && data.status){
            dispatch(setAuth(data.curr_user));
            setReload((prev) => !prev);
        }

    }   

    const handlerejectFrequest=async  (reqId)=>{
        const {data}=await usePostFetch('/rejectfrequest',{reqId})
        if(data && data.status){
            dispatch(setAuth(data.curr_user));
            setReload((prev) => !prev);
       }
    }


  return (
    <>
     { <div className="frequest">
                            {/* {loading && <p>Loading...</p>} */}
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
                        </div>}
    </>
  )
}

export default RequestBox
import './RequestBox.scss'
import { TiTick } from "react-icons/ti";
import noprofileimage from "../../assets/noProfileImage.png"
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { acceptFRequestThunk, getFRequests, rejectFRequestThunk } from '../../redux/fRequests';
import { useEffect } from 'react';


const RequestBox = () => {
    const {fr,loading}=useSelector(state =>state.requests);
    const user=useSelector(state => state.auth.auth);
    const dispatch=useDispatch()

    useEffect(()=>{
        if(user){

            dispatch(getFRequests(user.username))
        }

        
    },[])
    

   

    const handleacceptFrequest= (reqId)=>{
        dispatch(acceptFRequestThunk(reqId));

    }   

    const handlerejectFrequest= (reqId)=>{
        dispatch(rejectFRequestThunk(reqId));
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
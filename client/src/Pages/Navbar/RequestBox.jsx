import "./RequestBox.scss";
import noprofileimage from "../../assets/noProfileImage.png";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setAuth } from "../../redux/authReducer";
import useFetch from "../../hooks/useFetch";
import usePostFetch from "../../hooks/usePostFetch";
import { Link } from "react-router-dom";

const RequestBox = () => {
  const [reload, setReload] = useState(0);
  const [acceptfr, setAcceptFr] = useState(false);
  const [sendfr, setSendfr] = useState(false);
  const [follow , setFollow]=useState(true);
  const dispatch = useDispatch();

  const { data, loading, error } = useFetch("/get-requests", true, reload);

  const handleacceptFrequest = async (reqId) => {
    const { data } = await usePostFetch("/acceptfrequest", { reqId });

    if (data && data.curr_user) {
      dispatch(setAuth(data.curr_user));
      // setReload((prev) => prev + 1);
      setAcceptFr(true);
    }
  };

  const handlerejectFrequest = async (reqId) => {
    const { data } = await usePostFetch("/rejectfrequest", { reqId });
    if (data && data.curr_user) {
      dispatch(setAuth(data.curr_user));
      setReload((prev) => prev + 1);
    }
  };

  const handleSendFollowRequest = async (userId) => {
    const { data } = await usePostFetch("/sendfrequest", { userId });

    if (data && data.success) {
      setSendfr(true);
    } else {
      console.log("error while sending frequest");
    }
  };

  const handleWithdrawFollowRequest = async (userId) => {
    const { data } = await usePostFetch("/withdraw-request", {
      userId,
    });
    if (data && data.success) {
      // console.log(data.msg); toastify
      setSendfr(false);
    }
  };
  const handleUnfollow = async (userId) => {
    const { data } = await usePostFetch("/unfollow", { userId });

    if (data && data.success) {
      // console.log(data.msg); toastify
      setFollow(false);
      dispatch(setAuth(data.curr_user));
    }
  };

  return (
    <>
      <div className="frequest">
        {error ? (
          "error"
        ) : loading ? (
          "loading"
        ) : data?.frequests?.length > 0 ? (
          data?.frequests?.map((f) => {
            return (
              <div key={f.senderusername} className="individual">
                <Link to={`/profile/${f.senderusername}`} className="user">
                  <div>
                    <img
                      src={f.senderavatar?.url || noprofileimage}
                      alt="user avatar"
                    />
                  </div>
                  <div className="userdetails">
                    <span className="username">@{f.senderusername}</span>
                    <span>{f.sendername}</span>
                  </div>
                </Link>
                <div className="options">
                  <div
                    onClick={
                      acceptfr
                        ? (follow &&   f.isfollowing  )
                            ? () => {
                                
                                handleUnfollow(f.senderuserId);
                                }
                            :   sendfr
                                ? () => {
                                    handleWithdrawFollowRequest(
                                        f.senderuserId
                                    );
                                    }
                                : () => {
                                    handleSendFollowRequest(f.senderuserId);
                                    }
                        : () => {
                            handleacceptFrequest(f._id);
                          }
                    }
                    className="accept"
                  >
                    {acceptfr
                        ?  (follow &&   f.isfollowing  )
                            ? "Following"
                            : sendfr
                                ? "Requested"
                                : "Follow back"
                        : "Accept"}
                  </div>
                  {!acceptfr && (
                    <div
                      onClick={() => {
                        handlerejectFrequest(f._id);
                      }}
                      className="reject"
                    >
                      <RxCross2 />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="noRequests">No pending requests</p>
        )}
      </div>
    </>
  );
};

export default RequestBox;

import "./RequestBox.scss";
import noprofileimage from "../../assets/noProfileImage.png";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setAuth } from "../../redux/authReducer";
import useFetch from "../../hooks/useFetch";
import usePostFetch from "../../hooks/usePostFetch";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RequestBox = () => {
  const [reload, setReload] = useState(0);
  const [acceptfr, setAcceptFr] = useState(false);
  const [sendfr, setSendfr] = useState(false);
  const [follow, setFollow] = useState(true);
  const dispatch = useDispatch();

  const { data, loading, error } = useFetch("/get-requests", true, reload);

  const handleacceptFrequest = async (reqId) => {
    const data = await usePostFetch("/acceptfrequest", { reqId });

    if (data.data && data.data.curr_user) {
      dispatch(setAuth(data.data.curr_user));
      // setReload((prev) => prev + 1);
      setAcceptFr(true);
    } else if (data.data) {
      toast.warn(data.data.error || data.data.message, {
        position: "top-right"
      });
    } else {
      console.log(data);
      toast.error(data.error, {
        position: "top-right"
      });
    }
  };

  const handlerejectFrequest = async (reqId) => {
    const data = await usePostFetch("/rejectfrequest", { reqId });
    if (data.data && data.data.curr_user) {
      dispatch(setAuth(data.data.curr_user));
      setReload((prev) => prev + 1);
    } else if (data.data) {
      toast.warn(data.data.error || data.data.message, {
        position: "top-right"
      });
    } else {
      console.log(data);
      toast.error(data.error, {
        position: "top-right"
      });
    }
  };

  const handleSendFollowRequest = async (userId) => {
    const data = await usePostFetch("/sendfrequest", { userId });

    if (data.data && data.data.success) {
      setSendfr(true);
    } else if (data.data) {
      toast.warn(data.data.error || data.data.message, {
        position: "top-right"
      });
    } else {
      console.log(data);
      toast.error(data.error, {
        position: "top-right"
      });
    }
  };

  const handleWithdrawFollowRequest = async (userId) => {
    const data = await usePostFetch("/withdraw-request", {
      userId,
    });
    if (data.data && data.data.success) {
      // console.log(data.msg); toastify
      setSendfr(false);
    } else if (data.data) {
      toast.warn(data.data.error || data.data.message, {
        position: "top-right"
      });
    } else {
      console.log(data);
      toast.error(data.error, {
        position: "top-right"
      });
    }
  };

  const handleUnfollow = async (userId) => {
    const data = await usePostFetch("/unfollow", { userId });

    if (data.data && data.data.success) {
      // console.log(data.msg); toastify
      setFollow(false);
      dispatch(setAuth(data.data.curr_user));
    } else if (data.data) {
      toast.warn(data.data.error || data.data.message, {
        position: "top-right"
      });
    } else {
      console.log(data);
      toast.error(data.error, {
        position: "top-right"
      });
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
              <div key={f.sender.name} className="individual">
                <Link to={`/profile/${f.sender.username}`} className="user">
                  <div>
                    <img
                      src={f.sender.avatar?.url || noprofileimage}
                      alt="user avatar"
                    />
                  </div>
                  <div className="userdetails">
                    <span className="username">@{f.sender.username}</span>
                    <span>{f.sender.name}</span>
                  </div>
                </Link>
                <div className="options">
                  <div
                    onClick={
                      acceptfr
                        ? (follow && f.isfollowing)
                          ? () => {

                            handleUnfollow(f.sender._id);
                          }
                          : sendfr
                            ? () => {
                              handleWithdrawFollowRequest(
                                f.sender._id
                              );
                            }
                            : () => {
                              handleSendFollowRequest(f.sender._id);
                            }
                        : () => {
                          handleacceptFrequest(f._id);
                        }
                    }
                    className={acceptfr
                      ? (follow && f.isfollowing)
                        ? "following"
                        : sendfr
                          ? "requested"
                          : "follow_back"
                      : "accept"}
                  >
                    {acceptfr
                      ? (follow && f.isfollowing)
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

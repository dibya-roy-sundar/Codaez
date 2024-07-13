/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useEffect, useState } from "react";
import "./Changeuname.scss";
import Modal from "./Modal";
import usePutHook from "../../hooks/usePutHook";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../redux/authReducer";
import { ClipLoader } from "react-spinners";
import { SiTicktick } from "react-icons/si";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Changeuname = forwardRef(({ handleClose, changeUnameRef }) => {
  const [username, setUsername] = useState("");
  const [InputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(null);
  const [unique, setUnique] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.auth);

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
        } else {
          setUnique(false);
          // username already taken - Toastify
        }
      }
    };

    if (InputValue.length > 0) {
      changeuname();
    }
  }, [InputValue]);

  const handleChange = (e) => {
    setUsername(e.target.value);
    setLoading(true);
    if(username.trim()===e.target.value.trim()){
      setLoading(false);
    }
  };

  const removeData = () => {
    setUsername("");
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setInputValue(username.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [username]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.usernameChanged) {
      const { data } = await usePutHook("/change-username", {
        username: InputValue,
        save: true,
      });

      if (data && data.success && data.user) {
        // Toastify data.msg
        handleClose();
        removeData();
        dispatch(setAuth(data.user))
        navigate(`/profile/${data.user.username}`)
      }
    } else {
      // toastify -change username limit exceeded
    }
  };

  return (
    <Modal ref={changeUnameRef}>
      <div className="chnageunamecontainer">
        <p>Change Username</p>
        <div className="disclaimer">
          <p>
            {user?.usernameChanged
              ? "change username limit exceeded"
              : "You have the option to change your username once. Please choose carefully as it cannot be changed again."}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-wrap">
            <input
              id="username"
              name="username"
              value={username}
              onChange={(e) => handleChange(e)}
              required
            />
            <label htmlFor="username">Username</label>
            {(username.length > 0) && (
              <div className="spinner">
                {loading ? (
                  <ClipLoader
                    loading={loading}
                    color="#814fff"
                    className="icon"
                    size={16}
                    speedMultiplier={1}
                  />
                ) : unique ? (
                  <SiTicktick size={16} color="#814fff" />
                ) : (
                  <RiErrorWarningLine size={16} color="#e9bc28" />
                )}
              </div>
            )}
          </div>
          <div className="btn">
            <div className="closeform">
              <form method="dialog">
                <button className="btn" onClick={removeData}>
                  Cancel
                </button>
              </form>
            </div>
            <button
              className={(!unique || user?.usernameChanged) ? "disable btn" : "btn"}
              disabled={!unique || user?.usernameChanged}
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
});

export default Changeuname;

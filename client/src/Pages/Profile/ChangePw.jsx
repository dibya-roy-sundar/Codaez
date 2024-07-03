import { forwardRef } from "react"
import "./ChangePw.scss"
import Modal from "./Modal"
import Labelinput from "./Labelinput"

// eslint-disable-next-line react/display-name, react/prop-types
const ChangePw =forwardRef( ({changePwRef}) => {

    

  return (
    <Modal ref={changePwRef}>
        <div className="changepwcontainer">
            <p>Change your password</p>

            <form action="">
            <div className="inputfields">
            <Labelinput  password={true}  type="password" edit={true} name={"old password"} />
            <Labelinput password={true} type="password"  edit={true} name   ={"new password"} />

            <Labelinput password={true} type="password" edit={true} name={"confirm new password"} />
            </div>

            <div className="btn">
                <div className="closeform">
                    <form action="" method="dialog">

                        <button>cancel</button>
                    </form>
                </div>
            <button>Save</button>
            </div>

            </form>

        </div>
    </Modal>
  )
})

export default ChangePw
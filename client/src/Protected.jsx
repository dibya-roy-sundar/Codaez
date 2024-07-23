import { useSelector } from "react-redux"
import { Navigate, useLocation, useSearchParams } from "react-router-dom";


const Protected = ({children}) => {
    const user=useSelector(state => state.auth.auth);
    const [searchParams]=useSearchParams();
    const location=useLocation();

    const gauth=searchParams.get('fromgauth');
    const previousPath=location.pathname;

    if(previousPath==="/") {
      return <Navigate to={"/"} replace />
    }

    if(!gauth){
    if(!user  || Object.keys(user).length === 0){
        // pass state along with redirecting
       return  <Navigate to={"/auth"} replace state={{showToastify:true}} />
       // The replace prop in the Navigate component from react-router-dom replaces the current entry in the history stack instead of adding a new one. This means that when the user navigates to the /auth route, they won't be able to go back to the previous route by pressing the back button in the browser.
    }

    if(!user.username){
        return <Navigate to="/completeprofile" state={{fromregister:true}}/>
    }

  }

  return children;
}

export default Protected
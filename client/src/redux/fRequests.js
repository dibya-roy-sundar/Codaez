import {createSlice} from "@reduxjs/toolkit"
import useFetch from "../hooks/useFetch"
import usePostFetch from "../hooks/usePostFetch"
const initialState={
    fr:[],
    loading:false,
}

const fRequestSlice=createSlice({
    name:'requests',
    initialState,
    reducers:{
        setfRequest(state,action){
            state.fr=action.payload.frequests
        },
        removefRequest(state,action){
            // console.log("hello");
            state.fr=state.fr.filter((el) => el._id!==action.payload)
        },
        setLoading (state){
            state.loading=true;
        },
        removeloading (state) {
            state.loading=false;
        }
    }

})


export const fRequestActions=fRequestSlice.actions;
export default fRequestSlice.reducer;

export const getFRequests=(username) =>{
    return async (dispatch)=>{
        // dispatch(fRequestActions.setLoading());
        const {data}=await  usePostFetch('/get-requests',{username});  //get request and isloggedin and route
        // dispatch(fRequestActions.removeloading());
        if(data && data.status && data.frequests){
            dispatch(fRequestActions.setfRequest({frequests:data.frequests}));
        }
    } 
}

export const acceptFRequestThunk=(reqId) =>{
    return async (dispatch) =>{
        const {data}=await usePostFetch('/acceptfrequest',{reqId})
       
        if(data && data.status){
            console.log("hi");
            dispatch(fRequestActions.removefRequest(reqId));
        }
    }
}
export const rejectFRequestThunk=(reqId) =>{
    return async (dispatch) =>{
         const {data}=await usePostFetch('/rejectfrequest',{reqId})
         if(data && data.status){
            dispatch(fRequestActions.removefRequest(reqId));
        }
    }
}
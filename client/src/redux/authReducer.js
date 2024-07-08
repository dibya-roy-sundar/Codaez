import { createSlice } from "@reduxjs/toolkit";
import useFetch from "../hooks/useFetch";
import { makeRequest } from "../hooks/makeRequest";

const initialState = {
    auth: {}
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.auth = { ...action.payload }
        },
        removeAuth: (state, action) => {
            state.auth = {};
        }
    }
})

export const { setAuth, removeAuth } = authSlice.actions;

export default authSlice.reducer;


export const updateProfile=(username) =>{
    return async (dispatch)=>{
        try {
            // console.log("hello");
            const { data } =await makeRequest.get(`/profile/${username}?ownprofile=${true}`,{withCredentials:true});
            if(data && data.success){
                dispatch(setAuth(data.user));
            }
        } catch (error) {
            console.error("Error while profile fetching:", error);
        }
    }
}
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
    },
    reducers: {
        setUserDetails:(state,action)=>{
            console.log("Setting up User details;");
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
});

export const { login, logout ,setUserDetails,setUserLoginType} = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
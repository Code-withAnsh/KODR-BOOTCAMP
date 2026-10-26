import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/state/authSlice";

export let store = configureStore({
    reducer:{
        auth:authReducer,
    }

})
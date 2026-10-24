// ye sab ratna hoga documentation se --> abhi hum store bana rhe hai
 import { configureStore } from "@reduxjs/toolkit";
import counterReducer from '../features/CounterSlice';
 export const store = configureStore({
reducer:{
   counter:counterReducer
}
 })
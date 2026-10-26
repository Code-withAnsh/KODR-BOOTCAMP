import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name:"counter",
    initialState:{
count:0,
    },
    reducers:{
        increment:(state,action)=>{
state.count++
        },
        decrement:(state,action)=>{
state.count--;

        },
        incrementbyValue:(state,action)=>{
state.count+=action.payload

        }
    }
})
export const {increment,decrement,incrementbyValue} = counterSlice.actions
export default counterSlice.reducer
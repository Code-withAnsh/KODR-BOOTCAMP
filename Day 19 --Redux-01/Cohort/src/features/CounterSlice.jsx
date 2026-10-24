import { createSlice } from "@reduxjs/toolkit";
const counterSlice = createSlice({
  name: "counter",
  //ab ayega state jo data hold rkhega
  initialState: {
    count: 0,
  },
  //here is the actions for updating the states

  reducers: {
    //iska naam reducers hai lekin ye krte hai actions

    increment: (state) => {
        //ye jo state hai ye intialstate ko trigger karta hai
        //and initial state me hai count 0 aur use agar inc karna hai toh
        state.count++;
    },
    decrement: (state) => {
        //simmilarly here for dec
        state.count--;
    },
  },
});

export const {increment,decrement} = counterSlice.actions
// ab ye inc aur dec koi bhi apne ui me grab kar skta hai

export default counterSlice.reducer
//ye reducre hai updar reducers the both are difee that reducrrs are
// actions aur ye reducer hai 
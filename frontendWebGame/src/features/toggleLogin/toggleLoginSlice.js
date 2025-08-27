import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  status: false
}

const toggleLoginSlice = createSlice({
  name: "toggleLogin",
  initialState,
  reducers: {
    setStateFormLogin: (state, action) => {
      state.status = action.payload;

    },
  },
});

export const { setStateFormLogin } = toggleLoginSlice.actions;
export const selectStateLogin = (state) => state.toggleLogin.status;

export default toggleLoginSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Kiểm tra xem có token trong localStorage không
const token = localStorage.getItem("token");
const userStr = localStorage.getItem("user");

// user là object gồm userId, email, role
// còn token là token
const initialState = {
  user: userStr ? JSON.parse(userStr) : null,
  token: token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Lưu token và user vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
      logout: (state) => {
      state.user = null;
      state.token = null;
      // Xóa token và user khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
        console.log('After logout:', state);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;

export default authSlice.reducer;

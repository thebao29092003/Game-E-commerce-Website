import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { homeApiSlice } from "./homeApi/homeApiSlice";
import cartReducer from "./cartApi/cartSlice";
import { accountGameApiSlice } from "./accountGameApi/accountGameApiSlice";
import { igdbApiSlice } from "./igdbApi/igdbApiSlice";
import { detailGameApiSlice } from "./detailGameApi/detailGameApiSlice";
import { recommendGameApiSlice } from "./recommenGameApi/recommendGameApiSlice";
import { gameAdminApiSlice } from "./gameAdminApi/gameAdminApiSlice";
import { commentApiSlice } from "./commentApi/commentApiSlice";
import { orderApiSlice } from "./orderApi/orderApiSlice"; 
import { userApiSlice } from "./userApi/userApiSlice";
import { authApi } from "./auth/authApi";
import { otpApiSlice } from "./otpApi/otpApiSlice";
import { cartApi } from "./cartApi/cartApi";
import authReducer from "./auth/authSlice"
import toggleLoginReducer from "./toggleLogin/toggleLoginSlice"
import { profileApiSlice } from "./profile/profileApiSlice";
import { paymentApiSlice } from "./paymentApi/paymentApiSlice";

export const store = configureStore({
  reducer: {
    [homeApiSlice.reducerPath]: homeApiSlice.reducer,
    [accountGameApiSlice.reducerPath]: accountGameApiSlice.reducer,
    [igdbApiSlice.reducerPath]: igdbApiSlice.reducer,
    [detailGameApiSlice.reducerPath]: detailGameApiSlice.reducer,
    [recommendGameApiSlice.reducerPath]: recommendGameApiSlice.reducer,
    [gameAdminApiSlice.reducerPath]: gameAdminApiSlice.reducer,
    [commentApiSlice.reducerPath]: commentApiSlice.reducer,
    [orderApiSlice.reducerPath]: orderApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [otpApiSlice.reducerPath]: otpApiSlice.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [profileApiSlice.reducerPath]: profileApiSlice.reducer,
    [paymentApiSlice.reducerPath]: paymentApiSlice.reducer,
    cart: cartReducer,
    auth: authReducer,
    toggleLogin: toggleLoginReducer
  },

  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware().concat(
      accountGameApiSlice.middleware,
      homeApiSlice.middleware,
      igdbApiSlice.middleware,
      detailGameApiSlice.middleware,
      recommendGameApiSlice.middleware,
      gameAdminApiSlice.middleware,
      commentApiSlice.middleware,
      orderApiSlice.middleware,
      userApiSlice.middleware,
      authApi.middleware,
      otpApiSlice.middleware,
      cartApi.middleware,
      profileApiSlice.middleware,
      paymentApiSlice.middleware,
    ),
});

// Hàm này thiết lập các sự kiện lắng nghe (như focus hoặc online) 
// để RTK Query có thể phản ứng với các hành động của trình duyệt. 
// Nếu không gọi hàm này, refetchOnFocus sẽ không hoạt động.
setupListeners(store.dispatch);
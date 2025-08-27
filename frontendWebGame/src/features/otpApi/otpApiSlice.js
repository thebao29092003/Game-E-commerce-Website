import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";


export const otpApiSlice = createApi({
  reducerPath: "otpApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  // mình dùng proxy là server Flask của mình
  // nên chỉ cần chuyển title game
  endpoints: (builder) => ({
    getOtp: builder.mutation({
       query: ({email}) => ({
        url: `sendOTP`,
        method: "POST",
        body: {
          email
        },
      }),
    }),

    checkOtpChangePw: builder.mutation({
       query: ({email, otp, password}) => ({
        url: `checkOTP_resetPassword`,
        method: "POST",
        body: {
          email,
          otp, 
          password
        },
      }),
    }),

  }),
});

export const {
  useGetOtpMutation,
  useCheckOtpChangePwMutation
} = otpApiSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";


export const profileApiSlice = createApi({
  reducerPath: "profileApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  endpoints: (builder) => ({
    editUserName: builder.mutation({
       query: ({email, userName}) => ({
        url: `editUsername`,
        method: "POST",
        body: {
          email,
          userName
        },
      }),
    }),
    editPhone: builder.mutation({
       query: ({email, phone}) => ({
        url: `editPhone`,
        method: "POST",
        body: {
          email,
          phone
        },
      }),
    }),
    editPassword: builder.mutation({
       query: ({email, oldPassword, password}) => ({
        url: `editPassword`,
        method: "POST",
        body: {
          email,
          oldPassword,
          password
        },
      }),
    }),

  }),
});

export const {
  useEditUserNameMutation,
  useEditPhoneMutation,
  useEditPasswordMutation
} = profileApiSlice;

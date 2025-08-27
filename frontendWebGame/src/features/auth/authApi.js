import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { urlSpring } from "../urlBase";

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: urlSpring,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (emailPw) => ({
        url: 'loginApi',
        method: 'POST',
        body: emailPw,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: 'registerApi',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { 
  useLoginMutation,
  useRegisterMutation,
} = authApi;
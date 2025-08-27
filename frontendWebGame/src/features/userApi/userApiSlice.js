import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";


export const userApiSlice = createApi({
  reducerPath: "userApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  // mình dùng proxy là server Flask của mình
  // nên chỉ cần chuyển title game
  endpoints: (builder) => ({
    getListUser: builder.query({
       query: ({page}) => ({
        url: `listUser`,
        params: {
          page,
        },
      }),
    }),

    getUserForAd: builder.query({
       query: ({userId}) => ({
        url: `getUserTotalSpent`,
        params: {
          userId,
        },
      }),
    }),

    getUserByName: builder.query({
       query: ({userName, page}) => ({
        url: `getUserByName`,
        params: {
          userName,
          page
        },
      }),
    }),

  }),
});

export const {
  useGetListUserQuery,
  useGetUserForAdQuery,
  useGetUserByNameQuery,
} = userApiSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";

// chưa làm
export const cartApi = createApi({
  reducerPath: "cartApi",
  tagTypes: ["Cart"],
  baseQuery: fetchBaseQuery({
    baseUrl: urlSpring,
  }),
  endpoints: (builder) => ({
    addCart: builder.mutation({
      query: ({ userId, gameId }) => ({
        url: "addCart",
        method: "POST",
        body: {
          userId,
          gameId,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeItemCart: builder.mutation({
      query: ({ cartId }) => ({
        url: "deleteCartForWeb",
        method: "DELETE",
        params: {
          cartId,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
    listCart: builder.query({
      query: ({ userId, page }) => ({
        url: "listCartForWeb",
        method: "GET",
        params: {
          userId,
          page,
        },
      }),
      providesTags: ["Cart"],
    }),
  }),
});

export const { 
  useListCartQuery, 
  useAddCartMutation, 
  useRemoveItemCartMutation } = cartApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";

export const accountGameApiSlice = createApi({
  reducerPath: "accountGameApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  tagTypes: ['AccountGame'],
  endpoints: (builder) => ({
    getAccountGameByGameId: builder.query({
      query: ({ gameId, page }) => ({
        url: `listAccountGame`,
        params: {
          gameId,
          page,
        },
      }),
      providesTags: ['AccountGame'],
    }),

    addAccountGame: builder.mutation({
      query: ({ gameId, username, password}) => ({
        url: `addAccountGame`,
        method: "POST",
        body: {
          gameId,
          username,
          password
        },
      }),
      invalidatesTags: ['AccountGame'],
    }),

    editAccountGame: builder.mutation({
      query: ({ accountGameId, username, password }) => ({
        url: `updateAccountGame`,
        method: "PUT",
        body: {
          accountGameId,
          username,
          password
        },
      }),
      invalidatesTags: ['AccountGame'],
    }),

    deleteAccountGame: builder.mutation({
      query: (accountGameId) => ({
        url: `deleteAccountGame/${accountGameId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['AccountGame'],
    }),
  }),
});

export const {
useGetAccountGameByGameIdQuery,
useAddAccountGameMutation,
useEditAccountGameMutation,
useDeleteAccountGameMutation
} = accountGameApiSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";

export const gameAdminApiSlice = createApi({
  reducerPath: "gameAdminApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  endpoints: (builder) => ({
    addGameAdmin: builder.mutation({
       query: ({ gameName, gamePrice, gameDes,gameImgList, gameCategory  }) => ({
        url: `addGame`,
        method: "POST",
        body: {
          name: gameName,
          price: gamePrice,
          summary: gameDes,
          screenshots: gameImgList,
          genres: gameCategory
        },
      }),
    }),

     editGameAdmin: builder.mutation({
       query: ({ gameId, gamePrice, gameDes,gameName }) => ({
        url: `updateGame`,
        method: "PUT",
        body: {
          gameId,
          name: gameName,
          price: gamePrice,
          description: gameDes,
        },
      }),
    }),

    deleteGameAdmin: builder.mutation({
      query: (gameId) => ({
        url: `deleteGame/${gameId}`,
        method: "DELETE",
      }),
    }),

    getGameByOrderId: builder.query({
       query: ({ orderId, page, numberPerPage }) => ({
        url: `getGameByOrderId`,
        method: "GET",
        params: {
          orderId,
          page,
          numberPerPage
        },
      }),
    }),

    getGameBestSellYear: builder.query({
      query: () => ({
       url: `gameBuy12Months`,
       method: "GET",
     }),
   }),

  }),
});

export const {
  useAddGameAdminMutation,
  useEditGameAdminMutation,
  useDeleteGameAdminMutation,
  useGetGameByOrderIdQuery,
  useGetGameBestSellYearQuery
} = gameAdminApiSlice;

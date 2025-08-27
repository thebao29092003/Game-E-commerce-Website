import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";

export const homeApiSlice = createApi({
  reducerPath: "homeApiSlice",
  tagTypes: ["GameListNew"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}/home/`,
  }),
  endpoints: (builder) => ({
     // newest game list
    getGameListNew: builder.query({
      query: (page) => `gameList/${page}`,
      providesTags: ["GameListNew"],
    }),
     // newest game best sale
    getGameListBestSale: builder.query({
      query: (page) => `gameListBestSale/${page}`,
    }),
    getCategory: builder.query({
      query: () => "categories",
    }),
    getGameSearch: builder.query({
      query: ({ searchInput, page }) => ({
        url: `search`,
        params: {
          searchInput,
          page,
        },
      }),
    }),
    getGameByCategoryId: builder.query({
      query: ({ categoryId, page }) => ({
        url: `category`,
        params: {
          categoryId,
          page,
        },
      }),
    }),
  }),
  refetchOnFocus: true,
});

export const {
  useGetCategoryQuery,
  useGetGameListNewQuery,
  useGetGameListBestSaleQuery,
  useGetGameSearchQuery,
  useGetGameByCategoryIdQuery
} = homeApiSlice;

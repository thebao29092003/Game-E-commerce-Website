import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlFlask } from "../urlBase";

export const recommendGameApiSlice = createApi({
  reducerPath: "recommendGameApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlFlask}`,
  }),
  endpoints: (builder) => ({
    getRecommend: builder.query({
      query: ({gameName, gameId}) => ({
        url: `recommend`,
        params: {
          gameName,
          gameId
        },
      }),
    }),
  }),
});

export const {
  useGetRecommendQuery,
} = recommendGameApiSlice;

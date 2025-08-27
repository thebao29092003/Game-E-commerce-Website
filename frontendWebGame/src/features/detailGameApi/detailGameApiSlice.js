import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";


// providesTags: (result, error, gameId) => [{ type: "DetailGame", id:gameId }]: khi có detail game của gameId
// nào thay đổi thì cập nhật lại gameId đó

export const detailGameApiSlice = createApi({
  reducerPath: "detailGameApiSlice",
  tagTypes: ["DetailGame"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  endpoints: (builder) => ({
     // newest game list
    getGameByGameId: builder.query({
      query: (gameId) => `detail/game/${gameId}`,
      providesTags: (result, error, gameId) => [{ type: "DetailGame", id:gameId }],
    }),
  }),
});

export const {
  useGetGameByGameIdQuery,
  useLazyGetGameByGameIdQuery,
} = detailGameApiSlice;

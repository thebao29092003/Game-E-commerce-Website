import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlFlask } from "../urlBase";


export const igdbApiSlice = createApi({
  reducerPath: "igdbApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlFlask}`,
  }),
  // mình dùng proxy là server Flask của mình
  // nên chỉ cần chuyển title game
  endpoints: (builder) => ({
    getGameIGDB: builder.query({
       query: ({gameTitle}) => ({
        url: `add-game-igdb`,
        params: {
          gameTitle
        },
      }),
    }),
  }),
});

export const { useGetGameIGDBQuery } = igdbApiSlice;

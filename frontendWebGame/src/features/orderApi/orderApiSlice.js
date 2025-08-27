import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";


export const orderApiSlice = createApi({
  reducerPath: "orderApiSlice",
  tagTypes: ["OrderByUserId"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  // mình dùng proxy là server Flask của mình
  // nên chỉ cần chuyển title game
  endpoints: (builder) => ({
    getListOrder: builder.query({
       query: ({page, sortDirection, sortField}) => ({
        url: `listOrder`,
        params: {
          page,
          sortDirection,
          sortField,
        },
      }),
    }),

     getOrderRevenue: builder.query({
       query: () => ({
        url: `getOrderCountRevenue`,
        method: 'GET'
      }),
    }),

    getOrderByUserId: builder.query({
       query: ({userId, page, sortDirection, sortField}) => ({
        url: `getOrderByUserId`,
        params: {
          userId,
          page,
          sortDirection,
          sortField,
        },
      }),
      providesTags: ["OrderByUserId"],
    }),

  }),
});

export const {
  useGetListOrderQuery,
  useGetOrderRevenueQuery,
  useGetOrderByUserIdQuery,
} = orderApiSlice;

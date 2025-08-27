import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";

export const commentApiSlice = createApi({
  reducerPath: "commentApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  tagTypes: ["Comments", "HasUserBoughtGame"],
  endpoints: (builder) => ({
    getCommentByGameId: builder.query({
      query: ({ gameId, page }) => ({
        url: `reviewList`,
        params: {
          gameId,
          page,
        },
      }),
      providesTags: ["Comments"],
    }),

    addReview: builder.mutation({
      query: ({ gameId, comment, score, userId }) => ({
        url: `addReview`,
        method: "POST",
        body: {
          gameId,
          comment,
          score,
          userId,
        },
      }),
      invalidatesTags: ["Comments"],
    }),

    editReview: builder.mutation({
      query: ({ reviewId, comment, score }) => ({
        url: `updateReview`,
        method: "PUT",
        body: {
          reviewId,
          comment,
          score,
        },
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteReview: builder.mutation({
      query: ({ reviewId }) => ({
        url: `deleteReview`,
        params: {
          reviewId,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),

    hasUserBoughtGame: builder.query({
      query: ({ gameId, userId }) => ({
        url: `hasUserBuyGame`,
        method: "GET",
        params: {
          gameId,
          userId,
        },
       
      }),
      providesTags: ["HasUserBoughtGame"],
    }),
  }),
  // refetchOnFocus: true,
});

export const {
  useGetCommentByGameIdQuery,
  useAddReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
  useHasUserBoughtGameQuery,
} = commentApiSlice;

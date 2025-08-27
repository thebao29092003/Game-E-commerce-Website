import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlSpring } from "../urlBase";

/*
Mục đích: Đánh dấu cache của các game liên quan là "hết hạn" (stale) sau khi mutation payment được thực hiện thành công.
Cách hoạt động:
- arg.gameIds là mảng các gameId được gửi trong body của yêu cầu (ví dụ: ["1", "2"]).
- map tạo ra một mảng các thẻ, mỗi thẻ có dạng { type: "Game", id: gameId } (ví dụ: [{ type: "Game", id: "1" }, { type: "Game", id: "2" }]).
- Khi mutation hoàn tất, RTK Query sẽ vô hiệu hóa (invalidate) cache của các game có gameId tương ứng (ví dụ: dữ liệu từ getGameByGameId trong detailGameApiSlice trước đó).
- Kết quả: Các query liên quan (như useGetGameByGameIdQuery) sẽ tự động tải lại dữ liệu từ server để đảm bảo thông tin game được cập nhật sau khi thanh toán.
 */
export const paymentApiSlice = createApi({
  reducerPath: "paymentApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlSpring}`,
  }),
  endpoints: (builder) => ({
    payment: builder.mutation({
      query: ({ userId, sumPrice, gameIds }) => ({
        url: `addOrder`,
        method: "POST",
        body: {
          userId,
          sumPrice,
          gameIds,
        },
      }),
    }),
  }),
});

export const { usePaymentMutation } = paymentApiSlice;

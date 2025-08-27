import React from "react";
import GameDetail from "./gameDetail/GameDetail";
import RecommendSystem from "./recommendSystem/RecommendSystem";
import Comments from "./comment/Comments";
import { useLocation } from "react-router-dom";
import { useGetGameByGameIdQuery, detailGameApiSlice } from "../../features/detailGameApi/detailGameApiSlice";
import { BounceLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { usePaymentMutation } from "../../features/paymentApi/paymentApiSlice";
import { setStateFormLogin } from "../../features/toggleLogin/toggleLoginSlice";
import { showAlert } from "../../utility/popup/Popup";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { commentApiSlice } from "../../features/commentApi/commentApiSlice";
import { orderApiSlice } from "../../features/orderApi/orderApiSlice";

const DetailProductPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useDispatch();

  const { gameId } = location.state || {};
  const { data, isLoading } = useGetGameByGameIdQuery(gameId);
  const [triggerPayment, { isLoading: isLoadingPayment }] =
    usePaymentMutation();
  console.log("data", data);

  const handleCheckout = async () => {
    try {
      // nếu user chưa đăng nhập thì hiển thị form login
      if (!user) {
        dispatch(setStateFormLogin(true));
      } else {
        // nếu user đã đăng nhập thì gửi yêu cầu thanh toán
        const result = await triggerPayment({
          userId: user.id,
          sumPrice: data?.gameDetail[4],
          gameIds: [data?.gameDetail[0]],
        }).unwrap(); // Thêm unwrap() để bắt lỗi
        if (result) {
          // Xử lý khi thành công: reset form, hiển thị thông báo...
          showAlert("Thông báo !", "Thanh toán thành công", "success");

          // lấy lại danh sách đơn hàng của user trước khi chuyển đến trang order
          // đánh dấu tag OrderByUserId của orderApiSlice là invalid
          dispatch(orderApiSlice.util.invalidateTags(["OrderByUserId"]));

          // Refetch API hasUserBoughtGame
          dispatch(commentApiSlice.util.invalidateTags(["HasUserBoughtGame"]));

          // lấy lại detail game để cập nhật số account
          dispatch(detailGameApiSlice.util.invalidateTags([{type: "DetailGame", id: gameId}]));

          // chuyển hướng đến trang order
          navigate("/user/order");
        }
      }
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi thanh toán:", error);
      showAlert("Thông báo !", "Thanh toán thất bại", "error");
    }
  };
  return (
    <>
      {isLoading || isLoadingPayment ? (
        <BounceLoader
          color="rgb(0, 174, 215)"
          loading={true}
          cssOverride={{
            margin: "0 auto",
          }}
          size={150}
        />
      ) : (
        <>
          <GameDetail handleCheckout={handleCheckout} game={data?.gameDetail} />
          <RecommendSystem game={data?.gameDetail} />
          <Comments currentUserId={user?.id} game={data?.gameDetail} />
        </>
      )}
    </>
  );
};

export default DetailProductPage;

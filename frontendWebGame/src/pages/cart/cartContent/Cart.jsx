import "./Cart.css";
import { formatCurrency } from "../../../utility/format/FormatCurrency";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCartAsync } from "../../../features/cartApi/cartSlice";
import { setStateFormLogin } from "../../../features/toggleLogin/toggleLoginSlice";
import { usePaymentMutation } from "../../../features/paymentApi/paymentApiSlice";
import { BounceLoader } from "react-spinners";
import { showAlert } from "../../../utility/popup/Popup";
import { useNavigate } from "react-router-dom";
import { detailGameApiSlice } from "../../../features/detailGameApi/detailGameApiSlice";
import { orderApiSlice } from "../../../features/orderApi/orderApiSlice";

const Cart = ({ totalShow, itemInCart }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [triggerPayment, { isLoading }] = usePaymentMutation();
  const navigate = useNavigate();
  // sẽ lấy ra tất cả các value (không lấy key) và trả về một mảng:
  const itemsArray = itemInCart ? Object.values(itemInCart) : null;
  console.log("itemsArray", itemsArray);
  // console.log("user", user)

  // Dùng .reduce() để tính tổng giá toàn bộ game trong giỏ hàng.
  // Bắt đầu từ 0 → cộng dồn từng item.price.
  const getTotalCartAmount = () =>
    itemsArray?.reduce((total, item) => total + item.price, 0);

  const handleDeleteCart = (id) => {
    // console.log("id", id)
    dispatch(removeFromCartAsync(id));
  };

  const handleCheckout = async () => {
    try {
      if (!user) {
        dispatch(setStateFormLogin(true));
      } else {
        const result = await triggerPayment({
          userId: user.id,
          sumPrice: getTotalCartAmount(),
          gameIds: itemsArray.map((item) => item.gameId),
        }).unwrap(); // Thêm unwrap() để bắt lỗi
        if (result) {
          // Xử lý khi thành công: reset form, hiển thị thông báo...
          showAlert("Thông báo !", "Thanh toán thành công", "success");
          // xóa tất cả game trong giỏ hàng
          itemsArray.forEach((item) => {
            handleDeleteCart(user ? item.cartId : item.gameId);
          });
          // lấy lại danh sách đơn hàng của user trước khi chuyển đến trang order
          dispatch(orderApiSlice.util.invalidateTags(["OrderByUserId"]));

          // lấy lại detail game để cập nhật số account
          itemsArray.forEach((item) => {
            dispatch(detailGameApiSlice.util.invalidateTags([{type: "DetailGame", id: item.gameId}]));
          });
          
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

  const content = isLoading ? (
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
      <div className="cart-items">
        <div className="cart-items-title">
          <h3>Game</h3>
          <h3>Tên game</h3>
          <h3>Giá game</h3>
        </div>
        <br />
        <hr />
        {itemsArray?.map((item, index) => {
          return (
            <div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={item.images?.split(", ")[0]} alt="Lỗi hiển thị" />
                <div className="game-name">
                  <p>{item.title}</p>
                </div>

                <p>{formatCurrency(item.price)}</p>
                <p
                  onClick={() =>
                    handleDeleteCart(user ? item.cartId : item.gameId)
                  }
                  className="cross"
                >
                  <span>X</span>
                </p>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
      {totalShow && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h3>Tổng tiền</h3>
            <div>
              <div className="cart-total-details">
                <p>Tạm tính</p>
                <p>{formatCurrency(getTotalCartAmount())}</p>
              </div>

              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{formatCurrency(getTotalCartAmount())}</b>
              </div>
            </div>
            <button onClick={handleCheckout}>TIẾN HÀNH THANH TOÁN</button>
          </div>
        </div>
      )}
    </>
  );

  return <div className="cart-content">{content}</div>;
};

export default Cart;

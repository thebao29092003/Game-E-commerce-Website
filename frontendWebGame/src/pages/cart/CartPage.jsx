import React from "react";
import Cart from "./cartContent/Cart";
import { useListCartQuery } from "../../features/cartApi/cartApi";
import { useSelector } from "react-redux";
import { selectCart } from "../../features/cartApi/cartSlice";
import { BounceLoader } from "react-spinners";

const CartPage = () => {
  const user = useSelector(state => state.auth.user);
  const itemInCart = useSelector(selectCart);
  
  // Chỉ gọi query khi user đã đăng nhập
  const { data: cartData, isLoading } = useListCartQuery(
    { userId: user?.id },
    { skip: !user }
  );

  // Nếu user đăng nhập, lấy data từ API, ngược lại lấy từ local state
  const cartItems = user ? cartData?.cartList.reduce((acc, item) => {
    acc[item[1]] = {
      cartId: item[0],
      gameId: item[1],
      title: item[2],
      price: item[3],
      images: item[4],
    };
    return acc;
  }, {}) : itemInCart;

  if (isLoading) {
    return <BounceLoader
      color="rgb(0, 174, 215)"
      loading={true}
      cssOverride={{
        margin: "0 auto",
      }}
      size={150}
    />
  }

  return (
    <>
      <Cart
        itemInCart={cartItems}
        totalShow={true}
      />
    </>
  );
};

export default CartPage;

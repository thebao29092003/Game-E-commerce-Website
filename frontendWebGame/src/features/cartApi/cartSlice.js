import { createSlice } from "@reduxjs/toolkit";
import { showAlert } from "../../utility/popup/Popup";
import { cartApi } from "./cartApi";

const cartStr = localStorage.getItem("cart");

const initialState = {
  items: cartStr ? JSON.parse(cartStr) : {},
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const { id } = item;

      // này là kiểm tra gameId có trong giỏ hàng hay không
      // nếu có thì thông báo là game đã có trong giỏ hàng, ko thêm
      if (!state.items[id]) {
        state.items[id] = {
          gameId: id,
          cartId: item.cartId,
          title: item.title,
          price: item.price,
          images: item.images,
        };
        // Chỉ lưu vào localStorage nếu user chưa đăng nhập
        if (!action.payload.userId) {
          localStorage.setItem("cart", JSON.stringify(state.items));
        }
      } else {
        showAlert("Thông báo !", "Game này đã có trong giỏ hàng của bạn", "error");
      }
    },
    removeFromCart(state, action) {
      // delete item trong giỏ hàng theo cartId
      const {id} = action.payload;
      delete state.items[id];
      // Chỉ lưu vào localStorage nếu user chưa đăng nhập
      if (!action.payload.userId) {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    setCartItems(state, action) {
      state.items = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

// Đây là một Redux async thunk action dùng để thêm sản phẩm vào giỏ hàng, 
// xử lý cả trường hợp người dùng đã đăng nhập (gọi API) và chưa đăng nhập (lưu local)
// Là một thunk action (hàm bất đồng bộ trả về một hàm khác).
// Nhận item (sản phẩm cần thêm) làm tham số.
export const addToCartAsync = (item) => async (dispatch, getState) => {
  const { user } = getState().auth;

  if (user) {
    try {
      const result = await dispatch(
        cartApi.endpoints.addCart.initiate({
          userId: user.id,
          gameId: item.id,
        })
      ).unwrap();
      
      if (result.success) {
        dispatch(addToCart({ 
          ...item, 
          userId: user.id,
          cartId: result.cartId
        }));
      }
    } catch (error) {
      showAlert("Lỗi", "Không thể thêm vào giỏ hàng", "error");
      console.log(error);
    }
  } else {
    dispatch(addToCart(item));
  }
};

// Thunk action để xử lý xóa khỏi giỏ hàng
export const removeFromCartAsync = (id) => async (dispatch, getState) => {
  const { user } = getState().auth;

  if (user) {
    try {
      const result = await dispatch(
        cartApi.endpoints.removeItemCart.initiate({
          cartId: id,
        })
      ).unwrap();
      
      if (result.success) {
        dispatch(removeFromCart({ id, userId: user.id }));
      }
    } catch (error) {
      showAlert("Lỗi", "Không thể xóa khỏi giỏ hàng", "error");
    }
  } else {
    dispatch(removeFromCart({ id }));
  }
};

// Đây là một Redux async thunk action dùng để đồng bộ giỏ hàng từ local (khi người dùng chưa đăng nhập) 
// lên server sau khi người dùng đăng nhập thành công
export const syncCartAfterLogin = () => async (dispatch, getState) => {

  // Khi người dùng chưa đăng nhập, giỏ hàng được lưu tạm ở local (Redux store + localStorage).
  // Khi họ đăng nhập thành công, hàm này sẽ:
  // Đẩy toàn bộ sản phẩm từ local cart lên server.
  // Xóa giỏ hàng local sau khi đồng bộ xong.

  // Giỏ hàng local
  // items: Object chứa các sản phẩm trong giỏ hàng local (dạng { gameId1: item1, gameId2: item2 }).
  const { items } = getState().cart;

  // Thông tin người dùng
  const { user } = getState().auth;

  // Có user (đã đăng nhập).
  // Giỏ hàng local không rỗng (Object.keys(items).length > 0).
  // console.log("items", items)
  if (user && Object.keys(items).length > 0) {
    //  Chuyển object items thành mảng có dạng [["key", {value}], ["key", {value}]] để lặp.
    // xem note
    for (const [gameId, item] of Object.entries(items)) {
      try {
        const result = await dispatch(
          cartApi.endpoints.addCart.initiate({
            userId: user.id,
            gameId: gameId,
          })
        ).unwrap();

        if (result.success) {
          console.log(`Synced game ${gameId} to server cart`);
        }
      } catch (error) {
        console.log(`Failed to sync game ${gameId}`, error);
      }
    }
    // Xóa local cart sau khi đã đồng bộ
    localStorage.removeItem("cart");
    dispatch(setCartItems({}));
  }
};

export const { addToCart, removeFromCart, setCartItems, setLoading } = cartSlice.actions;
export const selectCart = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.isLoading;

export default cartSlice.reducer;

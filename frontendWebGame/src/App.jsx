import "./utility/colorFontSize.css";
import { useState, useRef, useEffect } from "react";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import DetailProductPage from "./pages/detailProduct/DetailProductPage";
import CartPage from "./pages/cart/CartPage";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/error/ErrorPage";
import OrdersPage from "./pages/userProfile/ordersPage/OrdersPage";
import AccountPage from "./pages/userProfile/accountPage/AccountPage";
import AddGameAdmin from "./pages/admin/addGameAdmin/AddGameAdmin";
import ListGameAdmin from "./pages/admin/listGameAdmin/ListGameAdmin";
import ManageUser from "./pages/admin/manageUser/ManageUser";
import DetailUser from "./pages/admin/manageUser/detailUser/DetailUser";
import ManageOrder from "./pages/admin/manageOrder/ManageOrder";
import DetailOrderAdmin from "./pages/admin/manageOrder/detailOrder/DetailOrderAdmin";
import OrderPerMonth from "./pages/admin/statistic/orderPerMonth/OrderPerMonth";
import RevenuePerMonth from "./pages/admin/statistic/revenuePerMonth/RevenuePerMonth";
import LayoutUser from "./utility/layout/LayoutUser";
import LayoutAdmin from "./utility/layout/LayoutAdmin";
import SearchResult from "./pages/searchResult/SearchResult";
import CategoryResult from "./pages/categoryResult/CategoryResult";
import ListGameAdminResult from "./pages/admin/listGameAdmin/listGameAdminResult/ListGameAdminResult";
import EditGameAdmin from "./pages/admin/editGameAdmin/EditGameAdmin";
import ListAccountGameAdmin from "./pages/admin/listAccountGameAdmin/ListAccountGameAdmin";
import AddAccountGame from "./pages/admin/accountGameAdmin/addAccountGame";
import EditAccountGame from "./pages/admin/accountGameAdmin/EditAccountGame";
import ListUserResult from "./pages/admin/manageUser/listUserResult/ListUserResult";
import { useSelector } from "react-redux";
import { selectStateLogin } from "./features/toggleLogin/toggleLoginSlice";
import DetailOrderUser from "./pages/userProfile/ordersPage/DetailOrderUser";
import CheckOtpNewPw from "./pages/forgotPassword/checkOtpNewPw";
import ChangePassPage from "./pages/userProfile/changePassPage/ChangePassPage"
import GameBestSellYear from "./pages/admin/statistic/gameBestSellYear/GameBestSellYear";

function App() {
  const selectShowLogin = useSelector(selectStateLogin)
  const theme = JSON.parse(localStorage.getItem("theme"));
  const divRef = useRef(null);
  // nếu ban đầu chưa có localStorage thì mặc định là light-mode
  const [isDarkMode, setIsDarkMode] = useState(theme === null ? false : theme);
  useEffect(() => {
    divRef.current.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const [forgotPassword, setForgotPassword] = useState(false);
  const [checkOtp, setCheckOtp] = useState(false);
  return (
    <>
      <div ref={divRef} className="app">
        <Routes>
          {/* route xài chung */}
          <Route path="/" element={<LayoutUser/>}>
            <Route index element={<HomePage />} />
            
            <Route path="cart" element={<CartPage />} />
            <Route path="search-result" element={<SearchResult />} />
            <Route path="category-result" element={<CategoryResult />} />

            {/* sau này dùng redux tollkit */}
            <Route path="detail" element={<DetailProductPage />} />

            {/* route cho user sẽ thêm route bảo vệ
            những ai đã đăng nhập và có role là user thì đc vào*/}
            <Route path="user">
              <Route path="order" element={<OrdersPage />} />
              <Route path="order/detail/:id" element={<DetailOrderUser />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="changePass" element={<ChangePassPage />} />
            </Route>
          </Route>

          {/*route cho admin  */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route path="list-game" element={<ListGameAdmin />} />
            <Route path="account-game"  >
              <Route index element={<ListAccountGameAdmin />}/>
              <Route path="add" element={<AddAccountGame />}/>
              <Route path="edit" element={<EditAccountGame />}/>
            </Route>

            <Route path="game-result" element={<ListGameAdminResult />} />
           

            <Route path="add-game" element={<AddGameAdmin />} />
            <Route path="edit-game" element={<EditGameAdmin />} />

            <Route path="manage-user">
              <Route index element={<ManageUser />} />
              <Route path=":id" element={<DetailUser />} />
              <Route path="list-user-result" element={<ListUserResult />} />
            </Route>
            {/* khi admin nhấn vào xem detail 1 user trong phần manage-user */}

            <Route path="manage-order">
              <Route index element={<ManageOrder />} />
              <Route path=":id" element={<DetailOrderAdmin />} />
            </Route>

            {/* thống kế số đơn hàng trong 12 tháng gần nhất*/}
            <Route path="statistic/order" element={<OrderPerMonth />} />
            {/* thống kế số doanh thu trong 12 tháng gần nhất*/}
            <Route path="statistic/revenue" element={<RevenuePerMonth />} />
            {/* thống kế game bán chạy năm gần nhất*/}
            <Route path="statistic/game-best-sell-year" element={<GameBestSellYear />} />
          </Route>

          {/* Route bắt tất cả đường dẫn không khớp */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        {selectShowLogin ? (
          <Login setForgotPassword={setForgotPassword} />
        ) : (
          <></>
        )}
        {forgotPassword ? (
          <ForgotPassword
            setForgotPassword={setForgotPassword}
            setCheckOtp={setCheckOtp}
          />
        ) : (
          <></>
        )}
        {checkOtp ? (
          <CheckOtpNewPw
            setCheckOtp={setCheckOtp}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;

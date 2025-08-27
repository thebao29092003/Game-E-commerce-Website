
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { icons } from "../../../assets/icons/icons";
import {logout} from "../../../features/auth/authSlice"
import { useDispatch } from "react-redux";
import { showConfirm } from "../../../utility/popup/Popup";
import { useNavigate } from "react-router-dom";

const SidebarComponent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation(); // lấy đường dẫn hiện tại
  const handleClick =  async() => {
    const result = await showConfirm(
      "Đăng xuất",
      "Bạn có muốn đăng xuất ?",
      "Đồng ý",
      "Hủy"
    );

    if (result.isConfirmed) {
      dispatch(logout())
      navigate("/", {replace: true})
    }
  };
  return (
    <>
      <Sidebar className="sidebar">
        <Menu
          menuItemStyles={{
            button: ({ active }) => {
              // only apply styles on first level elements of the tree
              return {
                color: "rgb(0, 174, 215)",
                fontSize: "18px",
                fontWeight: "500",
                backgroundColor: active ? "#e1f9f9" : undefined,
              };
            },
          }}
        >
          <MenuItem
            icon={
              <img
                style={{
                  width: "22px",
                }}
                src={icons.cart}
              ></img>
            }
            style={{padding: "30px 20px"}}
            className="active"
            component={<Link to="/user/order" />}
            active={location.pathname.includes("/user/order")}
          >
            Đơn hàng
          </MenuItem>
          <MenuItem
            icon={
              <img
                style={{
                  width: "18px",
                }}
                src={icons.userProfile}
              ></img>
            }
            active={location.pathname === "/user/account"}
            component={<Link to="/user/account" />}
            style={{padding: "30px 20px"}}
          >
            Tài khoản
          </MenuItem>
          <MenuItem
            icon={
              <img
                style={{
                  width: "20px",
                }}
                src={icons.changePassword}
              ></img>
            }
            style={{padding: "30px 20px"}}
            active={location.pathname === "/user/changePass"}
            component={<Link to="/user/changePass" />}
          >
            Đổi mật khẩu
          </MenuItem>
          <MenuItem
            icon={
              <img
                style={{
                  width: "20px",
                }}
                src={icons.logoutUser}
              ></img>
            }
            onClick={handleClick}
            style={{padding: "30px 20px"}}
          >
            Đăng xuất
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};

export default SidebarComponent;

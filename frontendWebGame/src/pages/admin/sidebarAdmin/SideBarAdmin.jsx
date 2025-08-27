import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { icons } from "../../../assets/icons/icons";
import "./SideBarAdmin.css"
import { useDispatch } from "react-redux";
import { showConfirm } from "../../../utility/popup/Popup";
import { logout } from "../../../features/auth/authSlice";

const SideBarAdmin = () => {
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
                src={icons.list}
              ></img>
            }
            style={{ padding: "30px 20px" }}
            className="active"
            component={<Link to="/admin/list-game" />}
            active={location.pathname.includes("/admin/list-game")}
          >
            Danh sách game
          </MenuItem>
          <MenuItem
            icon={
              <img
                style={{
                  width: "25px",
                }}
                src={icons.add}
              ></img>
            }
            active={location.pathname === "/admin/add-game"}
            component={<Link to="/admin/add-game" />}
            style={{ padding: "30px 20px" }}
          >
            Thêm game
          </MenuItem>
          <MenuItem
            icon={
              <img
                style={{
                  width: "25px",
                }}
                src={icons.userComment}
              ></img>
            }
            active={location.pathname.includes("/admin/manage-user")}
            component={<Link to="/admin/manage-user" />}
            style={{ padding: "30px 20px" }}
          >
            Quản lý người dùng
          </MenuItem>
          <MenuItem
            icon={
              <img
                style={{
                  width: "27px",
                }}
                src={icons.order}
              ></img>
            }
            active={location.pathname.includes("/admin/manage-order")}
            component={<Link to="/admin/manage-order" />}
            style={{ padding: "30px 20px" }}
          >
            Quản lý đơn hàng
          </MenuItem>

          <SubMenu label="Thống kê" icon={
               <img
               style={{
                 width: "26px",
                 scrollbar: "none"
               }}
               src={icons.statistic}
             />
          }>
             <MenuItem
            
            icon={
              <img
                style={{
                  width: "27px",
                  scrollbar: "none"
                }}
                src={icons.incremental}
              />
            }
            active={location.pathname.includes("/admin/statistic/game-best-sell-year")}
            component={<Link to="/admin/statistic/game-best-sell-year" />}
          
          >
            Game bán chạy
          </MenuItem>
            <MenuItem
            
              icon={
                <img
                  style={{
                    width: "27px",
                    scrollbar: "none"
                  }}
                  src={icons.order}
                />
              }
              active={location.pathname.includes("/admin/statistic/order")}
              component={<Link to="/admin/statistic/order" />}
            
            >
              Đơn hàng
            </MenuItem>
            <MenuItem
                 icon={
                  <img
                    style={{
                      width: "27px",
                      scrollbar: "none"
                    }}
                    src={icons.revenue}
                  />
                }
                active={location.pathname.includes("/admin/statistic/revenue")}
                component={<Link to="/admin/statistic/revenue" />}
            >Doanh thu</MenuItem>
          </SubMenu>

          <MenuItem
            icon={
              <img
                style={{
                  width: "28px",
                }}
                src={icons.logout}
              ></img>
            }
            onClick={handleClick}
            style={{ padding: "30px 20px" }}
          >
            Đăng xuất
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};

export default SideBarAdmin;

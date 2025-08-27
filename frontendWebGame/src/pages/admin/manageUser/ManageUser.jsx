import SideBarAdmin from "../sidebarAdmin/SideBarAdmin";
import Pagination from "../../home/pagination/Pagination";
import { useState } from "react";
import "./ManageUser.css";
import { Outlet, useNavigate } from "react-router-dom";
import SearchUserAdmin from "../searchAdmin/SearchUserAdmin";
import { useGetListUserQuery } from "../../../features/userApi/userApiSlice";
import { BounceLoader } from "react-spinners";
import { formatCurrency } from "../../../utility/format/FormatCurrency";

const ListGameAdmin = () => {
  // quản lí email, nameDisplay, tổng chi (tiền mà user đã mua game)
  // trạng thái (hoạt động, bị khóa). Tác vụ (xem chi tiết user, khóa || mở tài khoản)
  // khi click vào xem chi tiết user
  // Danh sách game đã mua (tên game, giá, ngày mua, trạng thái thanh toán (thành công, thất bại))

  const [currentPage, setCurrentPage] = useState(0);
  const { isLoading, data } = useGetListUserQuery({page: currentPage});
  const navigate = useNavigate()
  const handleClick = (userId) => {
    navigate(`/admin/manage-user/${userId}`, {state: {userId: userId}})
  }
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
    data?.userList?.map((item, index) => {
      return (
        <div key={index}>
          <div className="list-game-items-title manage-user">
            <div className="game-name">
              <p>{item[2]}</p>
            </div>
            <div className="game-name">
              <p>{item[1]}</p>
            </div>

             <div className="game-name">
              <p>{item[3]}</p>
            </div>

            <div className="game-name">
              <p>{formatCurrency(item[4])}</p>
            </div>

            <button onClick={() => handleClick(item[0])} className="game-name manage-user">Xem</button>
          </div>
          <hr />
        </div>
      );
    })
  );

  return (
    <>
      <div className="list-game-page">
        <SideBarAdmin />

        <div className="list-game-content">
          <SearchUserAdmin />
          <div className="list-game-items">
            <div className="list-game-items-title manage-user">
              <h3>Email</h3>
              <h3>Tên hiển thị</h3>
              
                <h3>Đơn hàng</h3>
                <h3>Tổng chi</h3>


              <h3>Tác vụ</h3>
            </div>
            <br />
            <hr />
            {content}
          </div>
          <Pagination
            className="pagination"
            totalPage={data?.totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* định nghĩa cho phần tử con manage-user/:id */}
      <Outlet />
    </>
  );
};

export default ListGameAdmin;

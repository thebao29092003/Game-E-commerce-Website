import "./DetailOrderAdmin.css";
import SideBarAdmin from "../../sidebarAdmin/SideBarAdmin";
import { useLocation } from "react-router-dom";
import { useGetGameByOrderIdQuery } from "../../../../features/gameAdminApi/gameAdminApiSlice";
import { BounceLoader } from "react-spinners";
import { useState } from "react";
import Pagination from "../../../home/pagination/Pagination";
import { formatCurrency } from "../../../../utility/format/FormatCurrency";

const DetailOrderAdmin = () => {
  const location = useLocation()
  const { detailOrder } = location.state || {};
  const [currentPage, setCurrentPage] = useState(0);

  const { isLoading, data } = useGetGameByOrderIdQuery({
    page: currentPage,
    orderId: detailOrder[0],
    numberPerPage: 6
  });
  console.log("detailOrder", detailOrder);

  const content = detailOrder ? (
    <div className="item-info-name-email">
      <div className="item-info-user">
        <label>Tên hiển thị</label>
        <p>{detailOrder[3]}</p>
      </div>

      <div className="item-info-user">
        <label>Địa chỉ email</label>
        <p>{detailOrder[4]}</p>
      </div>
      <div className="item-info-user">
        <label>Tổng tiền</label>
        <p>{formatCurrency(detailOrder[2])}</p>
      </div>
    </div>
  ) : (
    <p style={{fontSize: "18px", textAlign:"center"}}>Lỗi! xin vui lòng liên hệ với quản trị viên</p>
  );

  const gameContent = isLoading ? (
    <BounceLoader
      color="rgb(0, 174, 215)"
      loading={true}
      cssOverride={{
        margin: "0 auto",
      }}
      size={150}
    />
  ) : (
    <div style={{}} className="cart-items">
      <div style={{gridTemplateColumns: "1.4fr 1fr 1fr 1fr"}} className="cart-items-title">
        <h3>Tên game</h3>
        <h3>Giá game</h3>
        <h3>Tài khoản</h3>
        <h3>Mật khẩu</h3>
      </div>
      <br />
      <hr />
      {data.gameList?.map((item, index) => {
        return (
          <div key={index}>
            <div style={{gridTemplateColumns: "1.4fr 1fr 1fr 1fr"}} className="cart-items-title cart-items-item">
              <p>{item[0]}</p>
              <p>{formatCurrency(item[1])}</p>
              <p>{item[2]}</p>
              <p>{item[3]}</p>
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
  return (
    <>
      <div className="list-game-page">
        <SideBarAdmin />
        <div className="list-game-content">
         {content}
           {/* danh sách game trong chi tiết đơn hàng của user đó */}
          {gameContent}
            <Pagination
            className="pagination"
            totalPage={data?.totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
        
      </div>
    </>
  );
};

export default DetailOrderAdmin;

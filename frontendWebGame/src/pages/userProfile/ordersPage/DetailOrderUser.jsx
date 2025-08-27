import SidebarComponent from "../sidebar/SidebarComponent";
import { useLocation } from "react-router-dom";
import { useGetGameByOrderIdQuery } from "../../../features/gameAdminApi/gameAdminApiSlice";
import { BounceLoader } from "react-spinners";
import { useState } from "react";
import Pagination from "../../home/pagination/Pagination";
import { formatCurrency } from "../../../utility/format/FormatCurrency";
import { useGetUserForAdQuery } from "../../../features/userApi/userApiSlice";

const DetailOrderUser = () => {
  const location = useLocation()
  const { detailOrder } = location.state || {};
  const [currentPage, setCurrentPage] = useState(0);

  const { isLoading, data } = useGetGameByOrderIdQuery({
    page: currentPage,
    orderId: detailOrder[0],
    numberPerPage: 10
  });

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
    <div  className="cart-items">
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
        <SidebarComponent />
        <div className="list-game-content">
         {/* {content} */}
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

export default DetailOrderUser;

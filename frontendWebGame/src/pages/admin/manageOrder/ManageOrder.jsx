import HeaderAdmin from "../headerAdmin/HeaderAdmin";
import SideBarAdmin from "../sidebarAdmin/SideBarAdmin";
import "./ManageOrder.css";
import Pagination from "../../home/pagination/Pagination";
import { icons } from "../../../assets/icons/icons";
import { useGetListOrderQuery } from "../../../features/orderApi/orderApiSlice";
import { BounceLoader } from "react-spinners";
import { useState } from "react";
import { formatDate } from "../../../utility/format/FormatDate";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utility/format/FormatCurrency";

const ManageOrder = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0);
  const [sortDirection, setSortDirection] = useState("DESC");
  const [sortField, setSortField] = useState("sum_price");

  const { isLoading, data } = useGetListOrderQuery({
    page: currentPage,
    sortDirection: sortDirection,
    sortField: sortField,
  });

  const handleSortPrice = () => {
    setSortField("sum_price")
    if(sortDirection === "DESC"){
      setSortDirection("ASC")
    } else{
        setSortDirection("DESC")
    }
  }

  const handleSortDate = () => {
    setSortField("create_date")
    if(sortDirection === "DESC"){
      setSortDirection("ASC")
    } else{
        setSortDirection("DESC")
    }
  }

  const handleClick = (detailOrder) => {
    navigate(`/admin/manage-order/${detailOrder[0]}`, {
      state: { detailOrder },
    });
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
    data?.orderList?.map((item, index) => {
      return (
        <div key={index}>
          <div className="list-game-items-title manage-order">
            <div className="game-name">
              <p>{item[0]}</p>
            </div>
            <div className="game-name">
              <p>{item[3]}</p>
            </div>

            <div className="game-name">
              <p>{formatDate(item[1])}</p>
            </div>
            <div className="game-name">
              <p>{formatCurrency(item[2])}</p>
            </div>
            {/* chưa làm khi nào có phần thanh toán thậ */}
            <div className="game-name">
              {true ? (
                <p style={{ color: "#01df43", fontWeight: "500" }}>
                  Thành công
                </p>
              ) : (
                <p style={{ color: "red", fontWeight: "500" }}>Thất bại</p>
              )}
            </div>

            <button onClick={() => handleClick(item)} className="game-name manage-order">Xem</button>
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
          <div className="list-game-items">
            <div className="list-game-items-title manage-order">
              <h3>Mã đơn hàng</h3>
              <h3>Tên khách</h3>

               <div onClick={handleSortDate} className="total">
                <h3>Ngày đặt</h3>
                <img src={icons.sort} alt="Lỗi hiển thị" />
              </div>

              <div onClick={handleSortPrice} className="total">
                <h3>Tổng tiền</h3>
                <img src={icons.sort} alt="Lỗi hiển thị" />
              </div>

              <div className="status">
                <h3>Trạng thái</h3>
              </div>

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
    </>
  );
};

export default ManageOrder;

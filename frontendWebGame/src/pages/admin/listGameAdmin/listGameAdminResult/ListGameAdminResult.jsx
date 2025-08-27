import Pagination from "../../../home/pagination/Pagination";
import { icons } from "../../../../assets/icons/icons";
import { useState } from "react";
import SearchGameAdmin from "../../searchAdmin/SearchGameAdmin";
import { useGetGameSearchQuery } from "../../../../features/homeApi/homeApiSlice";
import { BounceLoader } from "react-spinners";
import { useLocation } from "react-router-dom";
import SideBarAdmin from "../../sidebarAdmin/SideBarAdmin";
import { useNavigate } from "react-router-dom";
import { useDeleteGameAdminMutation } from "../../../../features/gameAdminApi/gameAdminApiSlice";
import { formatCurrency } from "../../../../utility/format/FormatCurrency";
import { showAlert, showConfirm } from "../../../../utility/popup/Popup";
import { imgs } from "../../../../assets/imgs/imgs";

const ListGameAdminResult = () => {
  const location = useLocation();
  const { searchInput } = location.state || {};
  const [currentPage, setCurrentPage] = useState(0);
  const { isLoading, data } = useGetGameSearchQuery({
    searchInput,
    page: currentPage,
  });

  const [triggerDeleteGame] =
            useDeleteGameAdminMutation();

  const navigate = useNavigate();
  const handleEditGame = (game) => {
    // console.log("game", game);
    navigate(`/admin/edit-game`, { state: { game } });
  };
  const handleAccountGame = (game) => {
    // console.log("game", game);
    navigate(`/admin/account-game`, { state: { game } });
  };

  const handleDeleteGame = async(game) => {
    const gameId = game[0]
    try {
      const confirm = await showConfirm(
        "Xóa game",
        "Bạn có muốn xóa game này ?",
        "Đồng ý",
        "Hủy"
      );

      if (confirm.isConfirmed) {
        const result = await triggerDeleteGame(gameId).unwrap(); // Thêm unwrap() để bắt lỗi
        if (result) {
          showAlert("Thông báo !", "Xóa game thành công", "success");
        }
      }
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi xóa game:", error);
       showAlert("Thông báo !", "Xóa game thất bại", "error");
    }
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
    data?.gameList?.map((item, index) => {
      return (
        <div key={index}>
                  <div className="list-game-items-title list-game-items-item">
                    <div className="game-name">
                      <img src={item[7] ? item[7].split(", ")[0].replace('t_thumb', 't_screenshot_big') : imgs?.banSung} alt="Lỗi hiển thị" />
                    </div>
                    <div className="game-name">
                      <p>{item[1]}</p>
                    </div>
                    <div className="game-name">
                      <p>{formatCurrency(item[4])}</p>
                    </div>
        
                  {/* nút chuyển sang tài khoản của game đó */}
                    <button className="game-name" onClick={() => handleAccountGame(item)}>
                      <img src={icons.update} alt="Lỗi hiển thị" />
                    </button>
        
                    <button className="game-name" onClick={() => handleEditGame(item)}>
                      <img src={icons.edit} alt="Lỗi hiển thị" />
                    </button>
        
                    <button className="game-name" onClick={() => handleDeleteGame(item)}>
                      <img src={icons.remove} alt="Lỗi hiển thị" />
                    </button>
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
          <SearchGameAdmin />
          <div className="list-game-items">
            <div className="list-game-items-title">
              <h3>Hình ảnh</h3>
              <h3>Tên game</h3>
              <h3>Giá bán</h3>
              <h3>Tài khoản</h3>
              <h3>Chỉnh sửa</h3>
              <h3>Xóa</h3>
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

export default ListGameAdminResult;

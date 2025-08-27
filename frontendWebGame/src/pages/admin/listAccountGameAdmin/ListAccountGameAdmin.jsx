import "./ListAccountGameAdmin.css";
import SideBarAdmin from "../sidebarAdmin/SideBarAdmin";
import Pagination from "../../home/pagination/Pagination";
import { icons } from "../../../assets/icons/icons";
import { useState } from "react";
import { useGetAccountGameByGameIdQuery } from "../../../features/accountGameApi/accountGameApiSlice";
import { BounceLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import { showAlert } from "../../../utility/popup/Popup";
import { useDeleteAccountGameMutation } from "../../../features/accountGameApi/accountGameApiSlice";
import { showConfirm } from "../../../utility/popup/Popup";

const ListAccountGameAdmin = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const location = useLocation();
  const { game } = location.state || {};
  // console.log("game acc", game)

  const [toggleIcon, setToggleIcon] = useState(false);
  const [showHidePwd, setShowHidePwd] = useState(false);

  const { isLoading, data } = useGetAccountGameByGameIdQuery({
    page: currentPage,
    gameId: game[0],
  });

  const [triggerDeleteAccountGame] = useDeleteAccountGameMutation();

  const handleClickIcon = () => {
    setToggleIcon(!toggleIcon);
    setShowHidePwd(!showHidePwd);
  };

  const navigate = useNavigate();
  const handleAddAccountGame = (game) => {
    console.log("game", game);
    navigate(`/admin/account-game/add`, { state: { game } });
  };

  // chưa làm
  const handleEditGame = (accountGameOld, game) => {
    console.log("game", accountGameOld);
    navigate(`/admin/account-game/edit`, { state: { accountGameOld, game } });
  };

  const handleDeleteAccountGame = async (accountGame) => {
    const accountGameId = accountGame[0];
    try {
      const confirm = await showConfirm(
        "Xóa tài khoản game",
        "Bạn có muốn xóa tài khoản game này ?",
        "Đồng ý",
        "Hủy"
      );

      if (confirm.isConfirmed) {
        const result = await triggerDeleteAccountGame(accountGameId).unwrap(); // Thêm unwrap() để bắt lỗi
        if (result) {
          showAlert("Thông báo !", "Xóa tài khoản game thành công", "success");
        }
      }
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi xóa game:", error);
      showAlert("Thông báo !", "Xóa tài khoản game thất bại", "error");
    }
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
    data?.accountGameList?.map((item, index) => {
      return (
        <div key={index}>
          <div className="list-game-items-title list-game-items-item list-account">
            <div className="game-name">
              <p>{item[1]}</p>
            </div>
            <div className="game-name">
              <p>{showHidePwd === false ? "*********" : item[2]}</p>
            </div>

            <div className="game-name">
              <p>
                {item[3] === true ? (
                  <span style={{ color: "#04cb00" }}>Đã bán</span>
                ) : (
                  <span style={{ color: "#d6db04" }}>Chưa bán</span>
                )}
              </p>
            </div>

            <button
              className="game-name"
              onClick={() => handleEditGame(item, game)}
            >
              <img src={icons.edit} alt="Lỗi hiển thị" />
            </button>

            <button
              className="game-name"
              onClick={() => handleDeleteAccountGame(item)}
            >
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
          <div className="header-btn">
            <h2>Tài khoản của game: {game[1]}</h2>
            <button onClick={() => handleAddAccountGame(game)}>
              Thêm tài khoản
            </button>
          </div>

          <div className="list-game-items">
            <div className="list-game-items-title list-account">
              <h3>Tài khoản</h3>
              <div>
                <h3>Mật khẩu</h3>
                {toggleIcon === false ? (
                  <img
                    onClick={() => handleClickIcon()}
                    src={icons.eye_hide}
                    alt="Lỗi hiển thị"
                  />
                ) : (
                  <img
                    onClick={() => handleClickIcon()}
                    src={icons.eye_show}
                    alt="Lỗi hiển thị"
                  />
                )}
              </div>

              <h3>Trạng thái</h3>
              <h3>Chỉnh sửa</h3>
              <h3 style={{ textAlign: "center", width: "65%" }}>Xóa</h3>
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

export default ListAccountGameAdmin;

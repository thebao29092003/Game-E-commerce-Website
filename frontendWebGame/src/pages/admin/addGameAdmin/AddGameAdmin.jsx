import "./AddGameAdmin.css";
import LogicLogin from "../../../utility/LogicLogin";
import { useEffect, useState } from "react";
import SideBarAdmin from "../sidebarAdmin/SideBarAdmin";
import SearchGameIGDB from "../searchAdmin/SearchGameIGDB";
import { useLocation } from "react-router-dom";
import { useAddGameAdminMutation } from "../../../features/gameAdminApi/gameAdminApiSlice";
import { showAlert } from "../../../utility/popup/Popup";

const AddGameAdmin = () => {
  const location = useLocation();
  const { game } = location.state || {};
  const [triggerAddGame] =
    useAddGameAdminMutation();
  const [formGame, setFormGame] = useState({
    gameName: "",
    gameDes: "",
    gamePrice: "0",
    gameCategory: [],
    gameImg: "",
    gameImgList: [],
  });

  useEffect(() => {
    if (game) {
      setFormGame((prev) => ({
        ...prev,
        gameName: game.name,
        gameDes: game.summary,
        gameImg: game.cover.url,
        gameCategory: game.genres,
        gameImgList: game.screenshots,
      }));
    }
  }, [game]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra validate cơ bản
    if (!formGame.gameName.trim()) {
      showAlert("Thông báo !", "Tên game không được để trống", "warning")
      return;
    }
    if(formGame.gamePrice <= 0){
      showAlert("Thông báo !", "Giá tiền phải lớn hơn 0", "warning")
      return;
    }

    try {
      const result = await triggerAddGame(formGame).unwrap(); // Thêm unwrap() để bắt lỗi
      if (result) {
        // Xử lý khi thành công: reset form, hiển thị thông báo...
        setFormGame({
          gameName: "",
          gameDes: "",
          gamePrice: 0,
          gameCategory: [],
          gameImg: "",
          gameImgList: [],
        });
        showAlert("Thông báo !", "Thêm game thành công", "success")
      }
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi thêm game:", error);
      showAlert("Thông báo !", "Thêm game thất bại", "error")
    }

    // Gửi data lên API ở đây
  };

  return (
    <>
      <div className="account-page" style={{ height: "90vh" }}>
        {/* khi nhập tên game mik sẽ call api từ IGDB 
        về tạo search suggest cho admin, khi admin click
        vào game nào nó fill vào thông tin game bên dưới
        sau đó ad nhấn thêm game là lưu và database */}
        <SideBarAdmin />

         {/* Hiển thị thông báo lỗi */}
  

        <div className="search-info-game">
          <SearchGameIGDB />
          
          <fieldset
            className="change-password"
            style={{ border: "1px solid #ccc", padding: "16px" }}
          >
            <legend style={{ padding: "0 10px" }}>Thông tin game</legend>

            <div className="name-price-des" style={{ marginBottom: 12 }}>
              <div className="item-info">
                <label>Tên game</label>
                <input
                  type="text"
                  value={formGame?.gameName}
                  name="gameName"
                  onChange={(e) => LogicLogin.onChange(e, setFormGame)}
                />
              </div>

              <div className="item-info">
                <label>Giá game</label>
                <input
                  required
                  type="number"
                  value={formGame?.gamePrice}
                  name="gamePrice"
                  onChange={(e) => LogicLogin.onChange(e, setFormGame)}
                />
              </div>

              <div className="item-info">
                <label>Mô tả</label>
                <textarea
                  value={formGame?.gameDes}
                  name="gameDes"
                  onChange={(e) => LogicLogin.onChange(e, setFormGame)}
                  rows={6}
                />
              </div>
              <button onClick={(e) => handleSubmit(e)}>Lưu game</button>
            </div>

            <div className="img-game-admin">
              <div className="img">
                <label>Ảnh game</label>
                {formGame?.gameImg ? (
                  <img
                    src={formGame?.gameImg.replace("t_thumb", "t_720p")}
                    alt="Lỗi hiển thị"
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default AddGameAdmin;

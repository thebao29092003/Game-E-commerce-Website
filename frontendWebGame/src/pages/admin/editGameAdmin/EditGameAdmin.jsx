import LogicLogin from "../../../utility/LogicLogin";
import { useEffect, useState } from "react";
import SideBarAdmin from "../sidebarAdmin/SideBarAdmin";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditGameAdminMutation } from "../../../features/gameAdminApi/gameAdminApiSlice";
import { homeApiSlice } from "../../../features/homeApi/homeApiSlice";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../utility/popup/Popup";

const EditGameAdmin = () => {
  const location = useLocation();
  const  {game}  = location.state || {}; 
  const [triggerEditGame] =
      useEditGameAdminMutation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  
  const [formGame, setFormGame] = useState({
    gameId: null,
    gameName:"",
    gameDes: "",
    gamePrice:"0",
    gameCategory:"",
    gameImg: ""
  })

  useEffect(() => {
    if(game){
      setFormGame((prev) => ({
        ...prev,
        gameId: game[0],
        gameName:game[1],
        gameDes: game[3],
        gamePrice: game[4],
        gameImg: game[7]?.split(", ")[0]
      }));
    }
  }, [])

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
      const result = await triggerEditGame(formGame).unwrap(); // Thêm unwrap() để bắt lỗi
      if (result) {
        showAlert("Thông báo !", "Chỉnh sửa game thành công", "success")
        dispatch(homeApiSlice.util.invalidateTags(["GameListNew"]));
        navigate("/admin/list-game")
      }
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi chỉnh sửa game:", error);
      showAlert("Thông báo !", "Chỉnh sửa game thất bại", "error")
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

        <div className="search-info-game">
          <fieldset
            className="change-password"
            style={{ border: "1px solid #ccc", padding: "16px" }}
          >
            <legend style={{padding: "0 10px"}}>Thông tin game</legend>

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
                 <button onClick={(e) => handleSubmit(e)}>Lưu game</button>
              </div>
            </div>

            <div className="img-game-admin">
              <div className="img">
                <label>Ảnh game</label>
                 {formGame?.gameImg ? (
                  <img src={formGame?.gameImg.replace("t_thumb", "t_720p")} alt="Lỗi hiển thị" />
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

export default EditGameAdmin;

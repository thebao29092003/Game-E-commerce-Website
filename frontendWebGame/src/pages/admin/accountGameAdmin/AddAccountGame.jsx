
import SideBarAdmin from "../sidebarAdmin/SideBarAdmin";
import { icons } from "../../../assets/icons/icons";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./AddAccountGame.css"
import LogicLogin from "../../../utility/LogicLogin";
import { useAddAccountGameMutation } from "../../../features/accountGameApi/accountGameApiSlice";
import { showAlert } from "../../../utility/popup/Popup";
import { detailGameApiSlice } from "../../../features/detailGameApi/detailGameApiSlice";
import { useDispatch } from "react-redux";
const AddAccountGame = () => {
  const location = useLocation()
  const  {game}  = location.state || {}; 

  const [toggleIcon, setToggleIcon] = useState(false)
  const [showHidePwd, setShowHidePwd] = useState("password")

  const [accountGame, setAccountGame] = useState({
    gameId: game[0],
    username: "",
    password: ""
  })

  const [triggerAddAccountGame] = useAddAccountGameMutation()
  const dispatch = useDispatch();
  const handleClickIcon = () => {
    setToggleIcon(!toggleIcon)
    if(showHidePwd === "password"){
      setShowHidePwd("text")
    } else{
       setShowHidePwd("password")
    }
    
  }

  const handleAddAccount = async () => {
    // Kiểm tra validate cơ bản
    if (!accountGame.username.trim()) {
      showAlert("Thông báo !", "Tài khoản không được để trống", "warning")
      return;
    }
    if(!accountGame.password.trim()){

      showAlert("Thông báo !", "Mật khẩu không được để trống", "warning")
      return;
    }

    try {
      const result = await triggerAddAccountGame(accountGame).unwrap(); // Thêm unwrap() để bắt lỗi
      if (result) {
        // Xử lý khi thành công: reset form, hiển thị thông báo...
        setAccountGame((pre) => ({
          ...pre,
          username: "",
          password: "",
        }));
      showAlert("Thông báo !", "Thêm tài khoản game thành công", "success")
      }
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi thêm tài khoản game:", error);
      showAlert("Thông báo !", "Thêm tài khoản game thất bại", "error")
    }
  }


  return (
    <>
      <div className="list-game-page">
        <SideBarAdmin />

        <div className="list-game-content">
          <div className="header-btn">
            <h2>
              Tài khoản của game: {game[1] ? game[1] : "Không tìm thấy game"}
            </h2>
            <img
              src={game[7]?.split(", ")[0]?.replace("t_thumb", "t_720p")}
              alt=""
            />
          </div>
          <hr />
          <div className="account-game">
            <label htmlFor="username">Tài khoản *</label>
            <input
              onChange={(e) => {
                LogicLogin.onChange(e, setAccountGame);
              }}
              id="username"
              name="username"
              type="text"
              value={accountGame.username}
            />
          </div>
          <div className="account-game">
            <label htmlFor="password">Mật khẩu *</label>
            <input
              onChange={(e) => {
                LogicLogin.onChange(e, setAccountGame);
              }}
              id="password"
              name="password"
              type={showHidePwd}
              value={accountGame.password}
            />
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
          <button
            onClick={() => handleAddAccount()}
            className="btn-add-account"
          >
            Thêm tài khoản
          </button>
        </div>
      </div>
    </>
  );
};

export default AddAccountGame;

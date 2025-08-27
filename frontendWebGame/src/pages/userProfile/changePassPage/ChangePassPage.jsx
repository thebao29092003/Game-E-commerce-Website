import SidebarComponent from "../sidebar/SidebarComponent";
import { useEffect, useState } from "react";
import { icons } from "../../../assets/icons/icons";
import LogicLogin from "../../../utility/LogicLogin";
import { BounceLoader } from "react-spinners";
import { useGetUserForAdQuery } from "../../../features/userApi/userApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useEditPasswordMutation } from "../../../features/profile/profileApiSlice";
import { showAlert } from "../../../utility/popup/Popup";

const ChangePassPage = () => {
  const currentUser = useSelector(selectCurrentUser);

  const { isLoading, data: userInfo } = useGetUserForAdQuery({
    userId: currentUser.id,
  });

  const [changePassword, { isLoading: isLoadingChangePassword }] =
  useEditPasswordMutation();

  const [formAccount, setFormAccount] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isLoading) {
      <BounceLoader
        color="rgb(0, 174, 215)"
        loading={true}
        cssOverride={{
          margin: "0 auto",
        }}
        size={150}
      />;
    } else {
      setFormAccount((pre) => ({
        ...pre,
        email: userInfo?.user[2],
      }));
    }
  }, [userInfo]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formAccount.currentPassword || !formAccount.newPassword || !formAccount.confirmPassword) {
      showAlert("Thông báo !", "Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }
    if(isValidNewPassword === false) {
      showAlert("Thông báo !", "Mật khẩu không hợp lệ", "error");
      return;
    }
    if(isValidConfPassword === false) {
      showAlert("Thông báo !", "Mật khẩu mới không trùng với mật khẩu cũ", "error");
      return;
    }
    try {
      const result = await changePassword({
        email: formAccount.email,
        oldPassword: formAccount.currentPassword,
        password: formAccount.newPassword,
      }).unwrap(); // Thêm unwrap() để bắt lỗi
      if (result) {
        showAlert("Thông báo !", "Cập nhật thành công", "success");
        setFormAccount((pre) => ({
          ...pre,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.log(error);
      if(error.status === 400) {
        showAlert("Thông báo !", "Mật khẩu hiện tại không đúng", "error");
        return;
      }
      showAlert("Thông báo !", "Cập nhật thất bại", "error");
    }
  };

  const [showHideEye, setShowHideEye] = useState("password");
  const [showHideIcon, setShowHideIcon] = useState(true);
  const showHideHandler = () => {
    if (showHideEye === "password") {
      setShowHideEye("text");
      setShowHideIcon(false);
    } else {
      setShowHideEye("password");
      setShowHideIcon(true);
    }
  };

  const [isValidNewPassword, setIsValidNewPassword] = useState(true);
  const [isValidConfPassword, setIsValidConfPassword] = useState(true);

  return (
    <>
      <div className="account-page">
        <SidebarComponent />
        <div className="account-page-content">
          {isLoadingChangePassword ? (
            <BounceLoader
              color="rgb(0, 174, 215)"
              loading={true}
              cssOverride={{
                margin: "0 auto",
              }}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Nhóm 2: Đổi mật khẩu */}
              <fieldset
                className="change-password"
                style={{ border: "1px solid #ccc", padding: 16 }}
              >
                <legend>Thay đổi mật khẩu</legend>

                <div style={{ marginBottom: 12 }}>
                  {/* mình ko cần validate nữa vì signup mik đã làm rồi */}
                  <input
                    name="currentPassword"
                    type={showHideEye}
                    placeholder="Mật khẩu hiện tại"
                    value={formAccount.currentPassword}
                    onChange={(e) => {
                      LogicLogin.onChange(e, setFormAccount);
                    }}
                  />
                  {showHideIcon === false ? (
                    <img
                      onClick={() => showHideHandler()}
                      src={icons.eye_show}
                      className="show-hide-eye"
                    />
                  ) : (
                    <img
                      onClick={() => showHideHandler()}
                      src={icons.eye_hide}
                      className="show-hide-eye"
                    />
                  )}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <input
                    name="newPassword"
                    type={showHideEye}
                    placeholder="Mật khẩu mới"
                    value={formAccount.newPassword}
                    onChange={(e) => {
                      LogicLogin.onChange(e, setFormAccount);

                      const isValidNewPw = LogicLogin.vertifyPassword(
                        e.target.value
                      );
                      // ở đây vì mik ko bắt buộc phải nhập mật khẩu mới nếu
                      // ko có nhu cầu nên thêm e.target.value.length === 0 để khi
                      // user ko muốn đổi mật khẩu thì vẫn cho nộp form
                      if (isValidNewPw || e.target.value.length === 0) {
                        setIsValidNewPassword(true);
                      } else {
                        setIsValidNewPassword(false);
                      }
                    }}
                  />
                  {isValidNewPassword === false ? (
                    <div
                      style={{
                        margin: "15px 0",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          color: "#ff5252",
                          fontWeight: "500",
                        }}
                      >
                        Password phải đủ 8 kí tự trong đó ít nhất 1 chữ số, 1
                        chữ hoa và 1 chữ thường
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {showHideIcon === false ? (
                    <img
                      onClick={() => showHideHandler()}
                      src={icons.eye_show}
                      className="show-hide-eye"
                    />
                  ) : (
                    <img
                      onClick={() => showHideHandler()}
                      src={icons.eye_hide}
                      className="show-hide-eye"
                    />
                  )}
                </div>

                <div>
                  <input
                    name="confirmPassword"
                    type={showHideEye}
                    placeholder="Xác nhận mật khẩu mới"
                    value={formAccount.confirmPassword}
                    onChange={(e) => {
                      LogicLogin.onChange(e, setFormAccount);
                      const isValidConfPw = LogicLogin.vertifyRePassword(
                        formAccount.newPassword,
                        e.target.value
                      );

                      if (isValidConfPw || e.target.value.length === 0) {
                        setIsValidConfPassword(true);
                      } else {
                        setIsValidConfPassword(false);
                      }
                    }}
                  />
                  {isValidConfPassword === false ? (
                    <div
                      style={{
                        margin: "15px 0",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          color: "#ff5252",
                          fontWeight: "500",
                        }}
                      >
                        Mật khẩu không khớp
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {showHideIcon === false ? (
                    <img
                      onClick={() => showHideHandler()}
                      src={icons.eye_show}
                      className="show-hide-eye"
                    />
                  ) : (
                    <img
                      onClick={() => showHideHandler()}
                      src={icons.eye_hide}
                      className="show-hide-eye"
                    />
                  )}
                </div>
              </fieldset>

              <button disabled={isLoadingChangePassword} type="submit">
                Lưu thay đổi
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangePassPage;

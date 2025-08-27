import SidebarComponent from "../sidebar/SidebarComponent";
import "./AccountPage.css";
import { useEffect, useState } from "react";
import LogicLogin from "../../../utility/LogicLogin";
import { BounceLoader } from "react-spinners";
import { useGetUserForAdQuery } from "../../../features/userApi/userApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useEditUserNameMutation } from "../../../features/profile/profileApiSlice";
import { useEditPhoneMutation } from "../../../features/profile/profileApiSlice";
import { showAlert } from "../../../utility/popup/Popup";

const AccountPage = () => {
  const currentUser = useSelector(selectCurrentUser);

  const { isLoading, data: userInfo } = useGetUserForAdQuery({
    userId: currentUser?.id,
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
        displayName: userInfo?.user[1],
        email: userInfo?.user[2],
        phone: userInfo?.user[3],
      }));
    }
  }, [userInfo]);

  const [editUserName, { isLoading: isLoadingEditUserName }] =
    useEditUserNameMutation();
  const [editPhone, { isLoading: isLoadingEditPhone }] = useEditPhoneMutation();
  const [formAccount, setFormAccount] = useState({
    displayName: "",
    email: "",
    phone: "",
    address:""
  });
  const [isValidPhone, setIsValidPhone] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formAccount.displayName || !formAccount.phone) {
      showAlert("Thông báo !", "Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }
    if (isValidPhone === false) {
      showAlert("Thông báo !", "Số điện thoại không hợp lệ", "error");
      return;
    }
    try {
      const result1 = await editUserName({
        email: formAccount.email,
        userName: formAccount.displayName,
      }).unwrap(); // Thêm unwrap() để bắt lỗi
      const result2 = await editPhone({
        email: formAccount.email,
        phone: formAccount.phone,
      }).unwrap(); // Thêm unwrap() để bắt lỗi
      if (result1 && result2) {
        showAlert("Thông báo !", "Cập nhật thành công", "success");
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        showAlert("Thông báo !", "Số điện thoại bị trùng", "error");
        return;
      }
      showAlert("Thông báo !", "Đăng nhập thất bại", "error");
    }
  };

  return (
    <>
      <div className="account-page">
        <SidebarComponent />
        <div className="account-page-content">
          {isLoadingEditUserName || isLoadingEditPhone ? (
            <BounceLoader
              color="rgb(0, 174, 215)"
              loading={true}
              cssOverride={{
                margin: "0 auto",
              }}
              size={150}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Nhóm 1: Tên hiển thị + Email */}
              <div style={{ marginBottom: 32 }} className="user-name-email">
                <div className="user-name-account">
                  <label>Tên hiển thị *</label>
                  <input
                    name="displayName"
                    type="text"
                    value={formAccount.displayName}
                    onChange={(e) => {
                      LogicLogin.onChange(e, setFormAccount);
                    }}
                    placeholder="Tên hiển thị"
                    required
                  />
                </div>

                <div className="email-account" style={{ marginTop: 20 }}>
                  <label>Địa chỉ email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formAccount.email}
                    placeholder="Email"
                    required
                    readOnly
                  />
                </div>
                <div className="group" style={{ marginTop: 20 }}>
                  <label htmlFor="pass" className="label">
                    Số điện thoại
                  </label>
                  <input
                    type="number"
                    className="input"
                    data-type="number"
                    name="phone"
                    value={formAccount.phone}
                    onChange={(phone) => {
                      LogicLogin.onChange(phone, setFormAccount);
                      const isValidPhone = LogicLogin.vertifyPhone(
                        phone.target.value
                      );

                      if (isValidPhone) {
                        setIsValidPhone(true);
                      } else {
                        setIsValidPhone(false);
                      }
                    }}
                    required
                  />

                  {isValidPhone === false ? (
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
                        Số điện thoại không hợp lệ
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* khi đang load thì sẽ không click được */}
              <button
                disabled={isLoadingEditUserName || isLoadingEditPhone}
                type="submit"
              >
                Lưu thay đổi
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountPage;

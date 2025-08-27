import ReactDOM from "react-dom";
import "./Login.css";
import { imgs } from "../../assets/imgs/imgs";
import { icons } from "../../assets/icons/icons";
import { useState } from "react";
import LogicLogin from "../../utility/LogicLogin";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../features/auth/authApi";
import { jwtDecode } from "jwt-decode";
import { setCredentials } from "../../features/auth/authSlice";
import { setStateFormLogin } from "../../features/toggleLogin/toggleLoginSlice";
import { showAlert } from "../../utility/popup/Popup";
import { BounceLoader } from "react-spinners";
import { syncCartAfterLogin } from "../../features/cartApi/cartSlice";

function Login({ setForgotPassword }) {
  const [disableBtn, setdisableBtn] = useState({
    btnLogin: false,
    btnSigup: false,
  });

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

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });

  // validation cho phần sign up
  const [isValidPasswordSignUp, setIsValidPasswordSignUp] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [accountSignUp, setAccountSignUp] = useState({
    username: "",
    password: "",
    phone: "",
    email: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading: isLoadingRegister }] = useRegisterMutation();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();

  const handleClickLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(account).unwrap(); // Thêm unwrap() để bắt lỗi
      if (result) {
        const token = result?.token;
        // Xử lý khi thành công: reset form, hiển thị thông báo...
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        dispatch(
          setCredentials({
            user: {
              id: decodedToken.userId,
              role: decodedToken.role,
              email: decodedToken.email,
            },
            token: token,
          })
        );

        // tắt form register
        dispatch(setStateFormLogin(false));
        // Đồng bộ cart local và cart ở server
        dispatch(syncCartAfterLogin());
        // hiện thông báo
        showAlert("Thông báo !", "Đăng nhập thành công", "success");

        // Chuyển hướng dựa trên role
        if (decodedToken.role === "admin") {
          navigate("/admin/list-game");
        }
      }
    } catch (error) {
      showAlert("Thông báo !", "Đăng nhập thất bại", "error");
    }
  };

  const handleClickRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await register(accountSignUp).unwrap(); // Thêm unwrap() để bắt lỗi
      if (result) {
        const token = result?.token;
        // Xử lý khi thành công: reset form, hiển thị thông báo...
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        dispatch(
          setCredentials({
            user: {
              id: decodedToken.userId,
              role: decodedToken.role,
              email: decodedToken.email,
            },
            token: token,
          })
        );

        // tắt form register
        dispatch(setStateFormLogin(false));
        // hiện thông báo
        showAlert("Thông báo !", "Đăng ký thành công", "success");

        // Chuyển hướng dựa trên role
        if (decodedToken.role === "admin") {
          navigate("/admin/list-game");
        }
      }
    } catch (error) {
      // Xử lý lỗi từ API
      showAlert("Thông báo !", "Đăng ký thất bại", "error");
    }
  };

  return ReactDOM.createPortal(
    <div className="login-wrap">
      {isLoadingRegister || isLoadingLogin ? (
        <BounceLoader
          color="rgb(0, 174, 215)"
          loading={true}
          cssOverride={{
            margin: "0 auto",
          }}
          size={150}
        />
      ) : (
        <div
          className="login-html"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(237, 236, 214, 0.9), rgba(200, 238, 241, 0.9)), url(${imgs.bgLogin})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <img
            className="img-cancel"
            src={icons.cancel}
            alt="Lỗi hiển thị"
            onClick={() => dispatch(setStateFormLogin(false))}
          />
          <input
            id="tab-1"
            type="radio"
            name="tab"
            className="sign-in"
            defaultChecked
          />
          <label htmlFor="tab-1" className="tab">
            Đăng Nhập
          </label>
          <input id="tab-2" type="radio" name="tab" className="sign-up" />
          <label htmlFor="tab-2" className="tab">
            Đăng Ký
          </label>
          <div className="login-form">
            <form onSubmit={handleClickLogin} className="sign-in-htm">
              <div className="group">
                <label htmlFor="user" className="label">
                  Email
                </label>
                <input
                  type="text"
                  className="input"
                  name="email"
                  value={account.email}
                  onChange={(email) => {
                    LogicLogin.onChange(email, setAccount);
                  }}
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="pass" className="label">
                  Mật khẩu
                </label>
                <input
                  type={`${showHideEye}`}
                  className="input"
                  data-type={`${showHideEye}`}
                  value={account.password}
                  name="password"
                  onChange={(password) => {
                    LogicLogin.onChange(password, setAccount);
                    // const isValidPw = vertifyPassword(password.target.value);
                    const isValidPw = LogicLogin.vertifyPassword(
                      password.target.value
                    );
                    if (isValidPw) {
                      setIsValidPassword(true);
                      setdisableBtn((pre) => ({ ...pre, btnLogin: false }));
                    } else {
                      setIsValidPassword(false);
                      setdisableBtn((pre) => ({ ...pre, btnLogin: true }));
                    }
                  }}
                  required
                />
                {isValidPassword === false ? (
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
                      Password phải đủ 8 kí tự trong đó ít nhất 1 chữ số,
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#ff5252",
                        fontWeight: "500",
                      }}
                    >
                      1 chữ hoa và 1 chữ thường
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
              <div className="group">
                <button
                  type="submit"
                  disabled={disableBtn.btnLogin}
                  className="button"
                >
                  ĐĂNG NHẬP
                </button>
              </div>
              <div className="hr"></div>
              <div className="foot-lnk">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    return (
                      setForgotPassword(true),
                      dispatch(setStateFormLogin(false))
                    );
                  }}
                >
                  Quên mật khẩu ?
                </a>
              </div>
            </form>
            <form onSubmit={handleClickRegister} className="sign-up-htm">
              <div className="group">
                <label htmlFor="user" className="label">
                  Tài khoản
                </label>
                <input
                  type="text"
                  className="input"
                  onChange={(username) => {
                    LogicLogin.onChange(username, setAccountSignUp);
                  }}
                  name="username"
                  value={accountSignUp.username}
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="pass" className="label">
                  Mật khẩu
                </label>
                <input
                  type={`${showHideEye}`}
                  className="input"
                  data-type={`${showHideEye}`}
                  name="password"
                  value={accountSignUp.password}
                  onChange={(password) => {
                    LogicLogin.onChange(password, setAccountSignUp);
                    // const isValidPw = vertifyPassword(password.target.value);
                    const isValidPw = LogicLogin.vertifyPassword(
                      password.target.value
                    );
                    if (isValidPw) {
                      setIsValidPasswordSignUp(true);
                      setdisableBtn((pre) => ({ ...pre, btnSigup: false }));
                    } else {
                      setIsValidPasswordSignUp(false);
                      setdisableBtn((pre) => ({ ...pre, btnSigup: true }));
                    }
                  }}
                  required
                />
                {isValidPasswordSignUp === false ? (
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
                      Password phải đủ 8 kí tự trong đó ít nhất 1 chữ số,
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#ff5252",
                        fontWeight: "500",
                      }}
                    >
                      1 chữ hoa và 1 chữ thường
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
              <div className="group">
                <label htmlFor="pass" className="label">
                  Số điện thoại
                </label>
                <input
                  type="number"
                  className="input"
                  data-type="number"
                  name="phone"
                  value={accountSignUp.phone}
                  onChange={(phone) => {
                    LogicLogin.onChange(phone, setAccountSignUp);
                    const isValidPhone = LogicLogin.vertifyPhone(
                      phone.target.value
                    );

                    if (isValidPhone) {
                      setIsValidPhone(true);
                      setdisableBtn((pre) => ({ ...pre, btnSigup: false }));
                    } else {
                      setIsValidPhone(false);
                      setdisableBtn((pre) => ({ ...pre, btnSigup: true }));
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
              <div className="group">
                <label htmlFor="pass" className="label">
                  Địa chỉ email
                </label>
                <input
                  type="email"
                  name="email"
                  value={accountSignUp.email}
                  onChange={(email) => {
                    LogicLogin.onChange(email, setAccountSignUp);
                  }}
                  className="input"
                  required
                />
              </div>
              <div className="group">
                <button
                  type="submit"
                  disabled={disableBtn.btnSigup}
                  className="button"
                >
                  ĐĂNG KÝ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>,
    document.getElementById("login-root")
  );
}

export default Login;

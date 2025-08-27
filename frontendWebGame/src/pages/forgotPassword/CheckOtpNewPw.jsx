import { imgs } from "../../assets/imgs/imgs";
import { icons } from "../../assets/icons/icons";
import { setStateFormLogin } from "../../features/toggleLogin/toggleLoginSlice";
import { useDispatch } from "react-redux";
import { useCheckOtpChangePwMutation } from "../../features/otpApi/otpApiSlice";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { showAlert } from "../../utility/popup/Popup";
import LogicLogin from "../../utility/LogicLogin";
import { setCredentials } from "../../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

function CheckOtpNewPw({ setCheckOtp }) {
  const dispatch = useDispatch();
  const [isValidPassword, setIsValidPassword] = useState(true);
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

  const [changePw, setChangePw] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [triggerChangePw] = useCheckOtpChangePwMutation();
  const [isloading, setIsLoading] = useState(false);
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await triggerChangePw(changePw).unwrap(); // Thêm unwrap() để bắt lỗi
      setIsLoading(false);
      if (result) {
        // hiện thông báo
        showAlert("Thông báo !", "Thay đổi mật khẩu thành công", "success");

        // đăng nhập luôn
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

        // tắt form checkotp
        setCheckOtp(false)
        // hiện thông báo
        showAlert("Thông báo !", "Đăng nhập thành công", "success");
      }
    } catch (error) {
      console.log(error)
      showAlert("Thông báo !", "Thay đổi mật khẩu thất bại", "error");
      setIsLoading(false);
    }
  };
  return (
    <div className="login-wrap">
      {isloading ? (
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
            onClick={() => setCheckOtp(false)}
          />
          <input
            id="tab-1"
            type="radio"
            name="tab"
            className="sign-in"
            defaultChecked
          />
          <label htmlFor="tab-1" className="tab">
            Quên mật khẩu
          </label>
          <input id="tab-2" type="radio" name="tab" className="sign-up" />
          <label htmlFor="tab-2" className="tab" style={{ display: "none" }}>
            Đăng Ký
          </label>
          <div className="login-form">
            <div className="sign-in-htm">
              <div className="group">
                <label htmlFor="email" className="label">
                  Email của bạn
                </label>
                <input
                  id="email"
                  type="text"
                  className="input"
                  name="email"
                  value={changePw.email}
                  onChange={(email) => {
                    LogicLogin.onChange(email, setChangePw);
                  }}
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="otp" className="label">
                  Otp của bạn
                </label>
                <input
                  id="otp"
                  type="text"
                  className="input"
                  name="otp"
                  value={changePw.otp}
                  onChange={(otp) => {
                    LogicLogin.onChange(otp, setChangePw);
                  }}
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="pass" className="label">
                  Mật khẩu mới
                </label>
                <input
                  type={`${showHideEye}`}
                  className="input"
                  data-type={`${showHideEye}`}
                  value={changePw.password}
                  name="password"
                  onChange={(password) => {
                    LogicLogin.onChange(password, setChangePw);
                    // const isValidPw = vertifyPassword(password.target.value);
                    const isValidPw = LogicLogin.vertifyPassword(
                      password.target.value
                    );
                    if (isValidPw) {
                      setIsValidPassword(true);
                    } else {
                      setIsValidPassword(false);
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
              <div onClick={handleClick} className="group">
                <input
                  type="submit"
                  className="button"
                  value="Thay đổi mật khẩu"
                />
              </div>
              <div className="hr"></div>
              <div className="foot-lnk">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setCheckOtp(false), dispatch(setStateFormLogin(true));
                  }}
                >
                  Đăng nhập ?
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckOtpNewPw;

import { imgs } from "../../assets/imgs/imgs";
import { icons } from "../../assets/icons/icons";
import { setStateFormLogin } from "../../features/toggleLogin/toggleLoginSlice";
import { useDispatch } from "react-redux";
import { useGetOtpMutation } from "../../features/otpApi/otpApiSlice";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { showAlert } from "../../utility/popup/Popup";

function ForgotPassword({ setForgotPassword, setCheckOtp }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [getOtp] = useGetOtpMutation();
  const [isloading, setIsLoading] = useState(false);
  const changeEmail = (e) => setEmail(e.target.value);
  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await getOtp({ email: email }).unwrap(); // Thêm unwrap() để bắt lỗi
      setIsLoading(false);
      if (result) {
        // hiện thông báo
        showAlert(
          "Thông báo !",
          "Vui lòng kiểm tra email để nhận OTP",
          "success"
        );

        // chuyển sang form nhập otp, email, password xác nhận password
        setForgotPassword(false);
        setCheckOtp(true);
      }
    } catch (error) {
      showAlert("Thông báo !", "Xác thực thất bại", "error");
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
            onClick={() => setForgotPassword(false)}
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
                  value={email}
                  onChange={(email) => changeEmail(email)}
                  required
                />
              </div>
              <div onClick={handleClick} className="group">
                <input
                  type="submit"
                  className="button"
                  value="Xác thực email"
                />
              </div>
              <div className="hr"></div>
              <div className="foot-lnk">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setForgotPassword(false), dispatch(setStateFormLogin(true));
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

export default ForgotPassword;


import "./Footer.css";
import { icons } from "../../../assets/icons/icons";

const Footer = () => {

  const scrollHome = () => {
    window.scrollTo({
      top: 0,
      behavior:'smooth'
    })
  }

  return (
    <footer>
      <div className="footer" id="footer">
        <div className="footer-content">
          <div className="footer-content-left">
            <img src={icons.logo} alt="logo" />
            <p>
              BDLV Gaming là web bán game đa nền tảng (Steam, Epic Games, EA
              Games, Ubisoft) với giá cực kỳ hợp lý. BDLV Gaming cam kết mang
              đến trải nghiệm mua game bản quyền an toàn, uy tín và tiết kiệm.
            </p>
          </div>
          <div className="footer-content-center">
            <h2>Công ty BDLV GAMING</h2>
            <ul>
              <li>Trang chủ</li>
              <li>Về chúng tôi</li>
              <li>Đơn hàng của bạn</li>
              <li>Chính sách</li>
            </ul>
          </div>
          <div className="footer-content-right">
            <h2>Liên hệ với chúng tôi qua</h2>
            <ul>
              <li>0933-223-872</li>
              <li>BDLVGaming@gmail.com</li>
            </ul>
          </div>
        </div>
        <hr />
        <p className="footer-copyright">
          Copyright 2024 &copy; BDLVGaming.com - All Right Reserved
        </p>
        {/* sau này đưa nó xuống footer */}
        <a className="footer-float icons" onClick={scrollHome} style={{cursor: "pointer"}}>
          <img src={icons.homeFloat} alt="Lỗi hiển thị" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

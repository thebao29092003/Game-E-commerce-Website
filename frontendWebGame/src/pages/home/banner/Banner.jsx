
import "./Banner.css";
import { imgs } from "../../../assets/imgs/imgs";

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-contents">
        <h2>Luôn có tựa game bạn yêu thích !</h2>
        <p>
          BDLV Gaming là web bán game đa nền tảng (Steam, Epic Games, EA Games,
          Ubisoft) với giá cực kỳ hợp lý. Tại đây, người chơi có thể tìm thấy
          nhiều tựa game đa dạng thể loại, từ hành động, phiêu lưu đến thể thao,
          phù hợp với mọi sở thích. BDLV Gaming cam kết mang đến trải nghiệm mua
          game bản quyền an toàn, uy tín và tiết kiệm.
        </p>
      </div>

      <img src={imgs.banner1} alt="Lỗi hiển thị" />
    </div>
  );
};

export default Banner;

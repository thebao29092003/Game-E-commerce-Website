import { useState } from "react";
import "./GameDetail.css";
import { useRef, useEffect } from "react";
import FullscreenImageModal from "../../home/modal/FullscreenImageModal";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utility/format/FormatCurrency";
import { useDispatch } from "react-redux";
import { imgs } from "../../../assets/imgs/imgs";
import { icons } from "../../../assets/icons/icons";
import { addToCartAsync } from "../../../features/cartApi/cartSlice";

const GameDetail = ({ game, handleCheckout }) => {
  // console.log(game);
  const dispatch = useDispatch();
  const imgList = game
    ? game[7]?.split(", ")?.map((img) => {
        // nếu ảnh nào ko có t_thumb thì mình sẽ lấy ảnh đầu tiên bù vào
        if (!img.includes("t_thumb")) {
          return game[7]
            ?.split(", ")[0]
            ?.replace("t_thumb", "t_screenshot_big");
        } else {
          return img?.replace("t_thumb", "t_screenshot_big");
        }
      })
    : imgs.banSung;

  // console.log(imgList)

  const navigate = useNavigate();

  const handleClickAddCart = () => {
    dispatch(
      addToCartAsync({
        id: game[0],
        title: game[1],
        price: game[4],
        images: game[7],
      })
    );
    navigate("/cart");
  };

  const [disableBtn, setDisableBtn] = useState();
  // console.log("disableBtn", disableBtn)
  useEffect(() => {
    // khi số hàng trong kho hết thì ko cho thêm, ko thể mua ngay
    if (game[10] === 0) {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  }, [game]);

  const imgBigRef = useRef(null);
  const arrImgRef = useRef(null);

  const handleImgSmall = (e) => {
    const imgBig = imgBigRef.current;

    const imgSmall = e.target;

    if (imgBig && imgSmall) {
      imgBig.src = imgSmall.src;
      // console.log(imgBigRef.current)

      // Dùng Array.from() để chuyển đổi HTMLCollection thành mảng, sau đó sử dụng các phương thức mảng như map:
      // console.log(arrImgRef.current.children)
      const childrenArray = Array.from(arrImgRef.current.children);

      // trước khi gán class active cho itme được click thì mình
      // sẽ loại bỏ active ra khỏi item cũ trước rồi mới gán
      childrenArray.map((img) => (img.className = "img-product-small"));
      imgSmall.className = "img-product-small active";
    }
  };

  const [modalIndex, setModalIndex] = useState(null);
  const handleImgBig = (e) => {
    const imgBig = e.target;
    if (imgBig) {
      // trả về index mà imgBig.src chứa tên đó => tìm index của của big image
      // nếu ko tìm đc trả về -1
      const index = imgList.findIndex((name) => imgBig.src.includes(name));
      console.log(index);
      if (index !== -1) setModalIndex(index);
    }
  };

  const closeModal = () => setModalIndex(null);

  /*
  Đây là hàm chuyển về ảnh trước.
  setModalIndex là state setter cho modalIndex, thể hiện ảnh đang xem ở modal.
  Dùng hàm callback để đảm bảo lấy giá trị mới nhất (prev).
  prev > 0 ? prev - 1 : prev:
    Nếu không phải ảnh đầu tiên (chỉ số prev > 0) → giảm chỉ số đi 1 (ảnh trước).
    Nếu đang ở ảnh đầu tiên → giữ nguyên (không giảm nữa để tránh lỗi).
   */
  const showPrev = () => setModalIndex((prev) => (prev > 0 ? prev - 1 : prev));

  /*
  Đây là hàm chuyển sang ảnh tiếp theo.
  Nếu chưa tới ảnh cuối (prev < product.imgName.length - 1) → tăng chỉ số.
  Nếu đang ở ảnh cuối → giữ nguyên.
   */
  const showNext = () =>
    setModalIndex((prev) => (prev < imgList.length - 1 ? prev + 1 : prev));

  useEffect(() => {
    // Tìm phần tử danh sách
    const scrollList = document.querySelector(".arr-img");
    // Hàm xử lý sự kiện lăn chuột
    const handleWheel = (event) => {
      event.preventDefault(); // Ngăn chặn cuộn dọc mặc định
      scrollList.scrollLeft += event.deltaY * 1.8; // Cuộn ngang
    };
    // Gán sự kiện 'wheel' vào phần tử
    scrollList.addEventListener("wheel", handleWheel);
  }, []);

  return (
    <>
      {modalIndex !== null && (
        <FullscreenImageModal
          imageList={imgList}
          currentIndex={modalIndex}
          onClose={closeModal}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
      <section className="detail-my-product">
        <div className="container-img-content-detail">
          <div className="container-img-content">
            <div className="container-img">
              <img
                onClick={handleImgBig}
                ref={imgBigRef}
                className="img-product-big"
                src={imgList ? imgList[0] : imgs.banSung}
                alt="detail-my-product"
              />
              <div className="arr-img" ref={arrImgRef}>
                {imgList?.map((img, key) => (
                  <img
                    onClick={(e) => handleImgSmall(e)}
                    key={key}
                    className="img-product-small"
                    src={imgList[key]}
                    alt="product3"
                  />
                ))}
              </div>
            </div>
            <div className="container-content">
              <p className="name">{game[1]}</p>
              <p className="price">{formatCurrency(game[4])}</p>
              <p className="des">{game[3]}</p>
              <div className="instock-average-score">
                <p className="inStock">Số tài khoản Còn lại: {game[10]}</p>
                <p className="average-score">
                  {game[8]} đánh giá: {game[9]} <img src={icons.star} alt="" />
                </p>
              </div>

              <div className="btn-add-cart-buy">
                <button
                  disabled={disableBtn}
                  onClick={handleClickAddCart}
                  className="btn btn-add-cart"
                >
                  Thêm vào giỏ hàng
                </button>
                <button disabled={disableBtn} onClick={handleCheckout} className="btn btn-buy">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GameDetail;

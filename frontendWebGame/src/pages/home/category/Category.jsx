import "./Category.css";
import { imgs } from "../../../assets/imgs/imgs";
import { useRef, useEffect, useState } from "react";
import { scroll } from "./ScrollLogin.jsx";
import { BounceLoader } from "react-spinners";
import React from "react";
import { useNavigate } from "react-router-dom";

const Category = ({ isLoadingCate, dataCate }) => {
  const categoryMenuListRef = useRef(null);
  const navigate = useNavigate()
  const handleCategoryClick = (category) => {
    // console.log("category", category);
    navigate(`/category-result`, { state: { category } });
  };
  useEffect(() => {
    scroll(categoryMenuListRef);
  }, []);

  /*
    🧩 MỤC TIÊU CỦA CODE:
      Tự động scroll ngang danh sách game từ trái sang phải.
      Khi scroll đến cuối danh sách, sẽ trở lại đầu với hiệu ứng mượt.
      Nếu hover chuột vào danh sách, thì dừng animation để người dùng tự scroll.
   */
  //  trạng thái để biết người dùng có đang hover vào danh sách hay không.
  const [isHovered, setIsHovered] = useState(false);

  // animationFrame và isResetting nếu dùng let hoặc const mỗi lần component re-render,
  // những biến này sẽ bị reset lại về giá trị ban đầu. ➜
  // Mất hết dữ liệu đang xử lý, dẫn đến bug logic.
  // Vì vậy, dùng useRef để giữ giá trị giữa các lần render.

  // giữ ID của requestAnimationFrame để có thể huỷ khi cần.
  const animationFrame = useRef(null);

  // cờ tạm thời dùng để tránh scroll trong lúc đang quay về đầu danh sách.
  const isResetting = useRef(false);

  const scrollStep = () => {
    const container = categoryMenuListRef.current;
    // Nếu không có container, hoặc đang hover, hoặc đang reset thì không scroll.
    if (!container || isHovered || isResetting.current) return;

    /*
    scrollWidth: tổng chiều dài có thể cuộn của container.
    clientWidth: chiều rộng nhìn thấy được (viewport).
    → maxScroll là điểm cuộn cuối cùng.
    -10: cho padding 2 bên
     */
    const maxScroll = container.scrollWidth - container.clientWidth - 10;

    /*
    Mỗi lần gọi, dịch ngang 1px → tạo hiệu ứng chuyển động chậm.
    Sau đó tiếp tục gọi scrollStep bằng requestAnimationFrame → animation mượt mà.
     */
    if (container.scrollLeft < maxScroll) {
      container.scrollLeft += 1; // tốc độ chậm
      animationFrame.current = requestAnimationFrame(scrollStep);
    } else {
      // Đánh dấu đang reset bằng isResetting = true.
      isResetting.current = true;

      // Dùng scrollTo để quay về left: 0 với hiệu ứng mượt "smooth".
      container.scrollTo({ left: 0, behavior: "smooth" });

      // Đợi 3 giây sau khi quay về đầu → rồi mới tiếp tục scroll lại như ban đầu.
      setTimeout(() => {
        isResetting.current = false;
        animationFrame.current = requestAnimationFrame(scrollStep);
      }, 3000); // thời gian dừng tạm trước khi bắt đầu lại
    }
  };

  // useEffect để khởi động hoặc dừng animation
  useEffect(() => {
    // Nếu isHovered === false, thì bắt đầu chạy animation.
    // Nếu true (người dùng hover) → dừng animation.
    if (!isHovered) {
      // requestAnimationFrame Đặt hàm callback chạy trước lần render kế tiếp của trình duyệt (tức là 60 lần/giây nếu máy mượt).
      animationFrame.current = requestAnimationFrame(scrollStep);
    } else {
      // cancelAnimationFrame(id) Huỷ một requestAnimationFrame trước đó (nếu cần dừng animation giữa chừng).
      cancelAnimationFrame(animationFrame.current);
    }

    // return giúp huỷ animation khi component unmount hoặc khi isHovered thay đổi.
    return () => cancelAnimationFrame(animationFrame.current);
  }, [isHovered]);

  const content = isLoadingCate ? (
    <BounceLoader
      color="rgb(0, 174, 215)"
      loading={true}
      cssOverride={{
        margin: "0 auto",
      }}
      size={150}
    />
  ) : (
    dataCate?.map((item, index) => {
      // Lấy key ảnh từ ánh xạ
      // const imageKey = categoryImageMap[item.categoryImg.split('.jpg')[0]];
      // // Lấy ảnh từ object imgs
      // console.log(imageKey);
      const categoryImage =
        imgs[item?.categoryImg] || imgs.banSung; // Fallback ảnh mặc định
      return (
        <a key={index} onClick={() => handleCategoryClick(item)}>
          <img src={categoryImage} alt="Lỗi hiển thị" />
          <p className="category-name">{item.categoryName}</p>
        </a>
      );
    })
  );

  return (
    <div className="category-menu">
      <h1>Thể Loại</h1>
      <p className="category-menu-text">
        BDLV Gaming mang đến thế giới game đa dạng với nhiều thể loại hấp dẫn:
        Hành động kịch tính, phiêu lưu đầy cuốn hút, chiến thuật đòi hỏi tư duy,
        nhập vai sâu sắc, kinh dị rùng rợn, thể thao sôi động, giải đố sáng tạo
        và mô phỏng sống động. Dù bạn yêu thích thử thách, khám phá hay giải trí
        nhẹ nhàng, BDLV Gaming đều có tựa game phù hợp, đáp ứng mọi phong cách
        và sở thích của bạn!
      </p>

      <div
        ref={categoryMenuListRef}
        className="category-menu-list"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </div>
    </div>
  );
};

export default Category;

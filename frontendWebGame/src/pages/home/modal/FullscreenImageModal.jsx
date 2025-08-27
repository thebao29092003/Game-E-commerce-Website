import ReactDOM from "react-dom";
import "./FullscreenImageModal.css";
import { icons } from "../../../assets/icons/icons";
import { imgs } from "../../../assets/imgs/imgs";

const FullscreenImageModal = ({
  imageList,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => 
  {
    // console.log("imageList", imageList)
    // ReactDOM.createPortal là một hàm đặc biệt trong React 
    // giúp render một component ra bên ngoài cây DOM gốc của component 
    // đó — cụ thể là ra ngoài div#root

    // Giả sử bạn có một modal, tooltip, hoặc dropdown mà bạn muốn render
    //  ở tầng cao nhất của DOM (để tránh bị CSS như overflow: hidden, z-index, 
    // hay position: relative ở parent làm ảnh hưởng), thì bạn sẽ dùng createPortal.

    // ReactDOM.createPortal(child, container)
    // child: JSX hoặc component bạn muốn render.
    // container: DOM node nơi bạn muốn đưa child vào.
  return ReactDOM.createPortal(
    <div className="fullscreen-overlay" onClick={onClose}>
      {/* e.stopPropagation() giúp ngăn sự kiện từ phần tử con lan ra ngoài.
      Cụ thể khi mình click vào image-wrapper (khi ảnh được fullscreen) nếu ko có
      e.stopPropagation() thì onclick thẻ cha fullscreen-overlay cũng chạy làm cho modal bị 
      đóng lại mặc dù mình click vào ảnh chứ ko click ra ngoài*/}
      <div className="image-wrapper" onClick={(e) => e.stopPropagation()}>
        {currentIndex > 0 && (
          <button className="nav-button left" onClick={onPrev}>
            <img src={icons.arrowLeft} alt="Lỗi hiển thị" />
          </button>
        )}
        <img
          src={imageList[currentIndex] }
          className="fullscreen-image"
          alt="Zoom"
        />
        {currentIndex < imageList.length - 1 && (
          <button className="nav-button right" onClick={onNext}>
            <img src={icons.arrowRight} alt="Lỗi hiển thị" />
          </button>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default FullscreenImageModal;

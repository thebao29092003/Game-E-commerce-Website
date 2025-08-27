import React from 'react'
import "./RecommendSystem.css"
import { useRef, useEffect, useState} from "react";
import { imgs } from "../../../assets/imgs/imgs";
import { useLazyGetGameByGameIdQuery } from '../../../features/detailGameApi/detailGameApiSlice';
import { useGetRecommendQuery } from '../../../features/recommenGameApi/recommendGameApiSlice';
import { formatCurrency } from '../../../utility/format/FormatCurrency';
import { useNavigate } from 'react-router-dom';

const RecommendSystem = ({game}) => {
 const categoryMenuListRef = useRef(null);
 const navigate = useNavigate()
  const handleGameClick = (gameId) => {
    navigate(`/detail`, { state: { gameId } });
  };

 const [gameDetails, setGameDetails] = useState([])
 // Gọi API 1: Lấy danh sách game id
  const { data: recommendGame, isLoading: isRecommendLoading } = useGetRecommendQuery({
    gameName: game[1],
    gameId: game[0],
  });

   // Hook "lazy" của RTK Query → không gọi API ngay, mà chỉ gọi khi bạn dùng triggerGetGameDetail.
  const [triggerGetGameDetail] = useLazyGetGameByGameIdQuery();

      // Gọi API 2 sau khi có kết quả API 1
  useEffect(() => {
    if (recommendGame?.game_id) {
      const fetchAllGameDetails = async() => {
        // Gọi song song nhiều API cùng lúc → tối ưu tốc độ.
        // RTK Query trả về Promise chứa { data, error }.
        // unwrap() giúp "mở" Promise để lấy thẳng data.
        const details = await Promise.all(
          recommendGame.game_id.map((id) => triggerGetGameDetail(id).unwrap())
        )
        // console.log("details", details); 
          setGameDetails(details)
      }
      fetchAllGameDetails()
    }
  }, [recommendGame]);

  // console.log("gameDetails", gameDetails)
  const content = gameDetails.map((game, index) => (
    <a key={index} onClick={() => handleGameClick(game.gameDetail[0])} className="product-item product-item-recommend">
      <img
        src= {game?.gameDetail[7]? (game?.gameDetail[7]?.split(", ")[0]?.replace('t_thumb', 't_screenshot_big')): imgs.banSung}
        alt="lỗi hiển thị"
        className="product-item-image"
      />
      <div className="product-item-infor">
        <p className="product-item-name">
          {game.gameDetail[3]}
        </p>
      </div>
      <p className="product-item-price">{formatCurrency( game.gameDetail[4])}</p>
    </a>
  ));
 
   useEffect(() => {
     if (categoryMenuListRef.current) {
       const scrollList = categoryMenuListRef.current;
       scrollList.scrollLeft = 0; // Đặt vị trí cuộn ban đầu
       // Hàm xử lý sự kiện lăn chuột
       const handleWheel = (event) => {
         event.preventDefault(); // Ngăn chặn cuộn dọc mặc định
         scrollList.scrollLeft += event.deltaY * 1.8; // Cuộn ngang
       };
       // Gán sự kiện 'wheel' vào phần tử
       scrollList.addEventListener("wheel", handleWheel);
     }
   }, []);
 
   const [isHovered, setIsHovered] = useState(false);
   const animationFrame = useRef(null);
 
   const isResetting = useRef(false);
 
   const scrollStep = () => {
     const container = categoryMenuListRef.current;
     // Nếu không có container, hoặc đang hover, hoặc đang reset thì không scroll.
     if (!container || isHovered || isResetting.current) return;
     const maxScroll = container.scrollWidth - container.clientWidth - 10;
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
 
   return (
     <div className="category-menu">
      <h1 className='header-recommend-system'>Có thể bạn thích 😊</h1>
       <div
         ref={categoryMenuListRef}
         className="category-menu-list"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
       >
        {content}
       </div>
       <hr />
     </div>
   );
}

export default RecommendSystem

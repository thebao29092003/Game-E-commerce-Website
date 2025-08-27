import React from "react";
import "./ListGame.css";
import { imgs } from "../../../assets/imgs/imgs";
import Pagination from "../pagination/Pagination";
import { formatCurrency } from "../../../utility/format/FormatCurrency";
import { BounceLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const ListGame = (props) => {
  const {
    headerBestSeller,
    idList,
    listGame,
    isLoading,
    setCurrentPage,
  } = props;
  // console.log(dataNewGame);

  const navigate = useNavigate()
  const handleGameClick = (game) => {
    // Truyền toàn bộ game object qua state
    let gameId = game[0]
    navigate(`/detail`, { state: { gameId } });
  };



  const content = isLoading ? (
    <BounceLoader
      color="rgb(0, 174, 215)"
      loading={true}
      cssOverride={{
        margin: "0 auto",
      }}
      size={150}
    />
  ) : (
    // ở đây mình thêm slice để tạo 1 shadow copy vì dataNewGame là const ko thể thay đổi
    // và sort thì làm mảng gốc
    listGame?.gameList
      .map((item, index) => {
        return (
          <a onClick={() => handleGameClick(item)} className="product-item" key={index}>
            <img
              src={item[7] ? item[7].split(", ")[0].replace('t_thumb', 't_screenshot_big') : imgs.banSung}
              alt="lỗi hiển thị"
              className="product-item-image"
            />
            <div className="product-item-infor">
              <p className="product-item-name">{item[1]}</p>
            </div>
            <p className="product-item-price">{formatCurrency(item[4])}</p>
          </a>
        );
      })
  );

  return (
    <div className="product-display" id={idList ? idList : "list-newest"}>
      {headerBestSeller ? (
        <h1>{headerBestSeller}</h1>
      ) : (
        <h1>Danh Sách Game Mới Nhất</h1>
      )}

      <div className="product-display-list">{content}</div>
      {/* pagination */}
      {!isLoading && (
        <Pagination
          totalPage={listGame?.totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ListGame;

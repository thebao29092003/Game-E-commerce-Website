
import { useNavigate } from "react-router-dom";

// dùng cho đề xuất game từ IGDB để admin nhập game về cửa hàng
const SearchSuggestAdmin = ({listGameSuggest, setDisplayValue, setSearchInput}) => {
  const navigate = useNavigate();
  
  const handleGameClick = (game) => {
    setDisplayValue("")
    setSearchInput("")
    // console.log(game)
    navigate(`/admin/add-game`, { state: { game } });
  };
  // console.log(listGameSuggest)

  const content = listGameSuggest.game?.map((item, key) => (
    <div className="game-item admin" key={key} onClick={() => handleGameClick(item)}>
      <img src={"https:"+item?.cover?.url.replace("t_thumb", "t_720p")} alt="Lỗi hiển thị" />
      <div className="info">
        <p className="title admin">{item.name}</p>
        <p className="price">
          {item?.summary?.slice(0, 50) + (item?.summary?.length > 50 ? '...' : '')}
        </p>
      </div>
    </div>
  ));

  return (
    <div className="search-suggestions">
      {content}
    </div>
  );
};

export default SearchSuggestAdmin;

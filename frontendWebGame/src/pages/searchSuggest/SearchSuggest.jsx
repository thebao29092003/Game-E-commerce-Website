
import "./SearchSuggest.css";
import { formatCurrency } from "../../utility/format/FormatCurrency";
import { useNavigate } from "react-router-dom";
import { imgs } from "../../assets/imgs/imgs";

const SearchSuggest = ({listGameSuggest, setDisplayValue, setSearchInput}) => {
  const navigate = useNavigate();
  // const location = useLocation()
  // console.log("location", location.pathname)
  const handleGameClick = (game) => {
    // if(location.pathname.includes("/admin/list-game")){
    //   navigate(`/detail`, { state: { game } });
    // }
    setDisplayValue("")
    setSearchInput("")
    // console.log(game)
    let gameId = game[0]
    navigate(`/detail`, { state: { gameId } });
  };
  // chỉ để xuất tối đa 3 item
  let listGameSuggestThreeItem = listGameSuggest?.gameList.slice(0, 9)
  const content = listGameSuggestThreeItem?.map((item, key) => (
    <div className="game-item" key={key} onClick={() => handleGameClick(item)}>
      <img src={item[7] ? item[7].split(", ")[0].replace('t_thumb', 't_screenshot_big') : imgs?.banSung} alt="Lỗi hiển thị" />
      <div className="info">
        <p className="title">{item[1]}</p>
        <p className="price">
          <span className="sale">{formatCurrency(item[4])}</span>
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

export default SearchSuggest;

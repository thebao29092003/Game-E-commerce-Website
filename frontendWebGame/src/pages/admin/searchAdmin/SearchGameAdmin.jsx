import { icons } from "../../../assets/icons/icons";
import { useState} from "react";
import { useNavigate } from "react-router-dom";

const SearchGameAdmin = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const handleSearchClick = (searchInput, e) => {
    // submit form thì cần cái này để tránh load lại
    e.preventDefault();
    // Truyền toàn bộ game object qua state
    // console.log(searchInput);
    
    setSearchInput("");
    navigate(`/admin/game-result`, { state: { searchInput } });
  };


  return (
    <div className="search" style={{ marginBottom: "20px" }}>
      <form action="" method="GET">
        <label htmlFor="searchInput">
          <input
            id="searchInput"
            type="text"
            name="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
            placeholder="Nhập tên game cần tìm ?"
          />
        </label>
        <button onClick={(e) => handleSearchClick(searchInput, e)}>
          <img src={icons.search} alt="Tìm kiếm" />
        </button>
      </form>
    </div>
  );
};

export default SearchGameAdmin;

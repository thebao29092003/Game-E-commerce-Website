import { useState, useCallback, useEffect} from "react";
import { useGetGameIGDBQuery } from "../../../features/igdbApi/igdbApiSlice";
import { debounce } from "lodash";
import SearchSuggestAdmin from "../searchSuggestAdmin/SearchSuggestAdmin";

const SearchGameIGDB = () => {
  const [searchInput, setSearchInput] = useState("");
  // Dùng để gọi hiển thị
  const [displayValue, setDisplayValue] = useState("");

  // khi user nhập name => show gợi ý ngay phía dưới
  // Sử dụng query với searchText làm tham số
  // mặc định trang để đề xuất là trang 0
  const { data: suggestions, isLoading: isLoadingSearch } =
  useGetGameIGDBQuery(
      {
        gameTitle:searchInput
      },
      {
        skip: searchInput?.length < 3, // Chỉ gọi API khi có từ 3 ký tự
      }
    );

  // Xử lý debounce
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchInput(value);
    }, 200),
    []
  );

  // Cleanup khi component unmount hoặc dependencies thay đổi
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setDisplayValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="search" style={{ marginBottom: "20px" }}>
      <form>
        <label htmlFor="searchInput">
          <input
            id="searchInput"
            type="text"
            name="searchInput"
            value={displayValue}
            onChange={(e) => handleInputChange(e)}
            autoFocus
            placeholder="Nhập tên game cần thêm vào cửa hàng ?"
          />
        </label>

        {!isLoadingSearch &&
        searchInput.length >= 3 &&
        suggestions?.game.length > 0 ? (
          <SearchSuggestAdmin
            listGameSuggest={suggestions}
            setSearchInput={setSearchInput}
            setDisplayValue={setDisplayValue}
          />
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default SearchGameIGDB;

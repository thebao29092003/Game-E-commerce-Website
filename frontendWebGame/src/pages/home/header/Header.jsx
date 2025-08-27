import { icons } from "../../../assets/icons/icons";
import "./Header.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { waapi, stagger } from "animejs";
import { Link, useNavigate } from "react-router-dom";
import SearchSuggest from "../../searchSuggest/SearchSuggest";
import {
  useGetCategoryQuery,
  useGetGameSearchQuery,
} from "../../../features/homeApi/homeApiSlice";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import {setStateFormLogin} from "../../../features/toggleLogin/toggleLoginSlice"

function Header() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  const bdlvGamingRef = useRef(null);
  const { isLoading, data } = useGetCategoryQuery();
  const [toggleCategory, setToggleCategory] = useState(false);
  // truyền category qua page /category-result trang này sẽ call api
  const handleCategoryClick = (category) => {
    // console.log("category", category);
    setToggleCategory(false);
    navigate(`/category-result`, { state: { category } });
  };

  const handleClickCart = () => {
    navigate(`/cart`);
  };
  const category = isLoading ? (
    <></>
  ) : (
    data?.map((item, key) => (
      <a
        onClick={() => handleCategoryClick(item)}
        style={{ cursor: "pointer" }}
        key={key}
      >
        {item.categoryName}
      </a>
    ))
  );

  useEffect(() => {
    waapi.animate(".bdlv-gaming p", {
      translate: `0 -20px`,
      delay: stagger(70),
      duration: 1000,
      loop: true,
      alternate: true,
      ease: "inOut(3)",
    });
  }, []);

  // phải tách ra vậy bởi vì sau 300ms mỗi khi user gõ chữ
  // thì mik mới gọi api 1 lần tránh quá tải, mà nếu gõ
  // mà 300ms sau mới hiện chữ thì user lại thấy giật lag
  // thế nên phải tách ra

  // Hiển thị trên UI
  const [searchInput, setSearchInput] = useState("");

  // Dùng để hiển thị
  const [displayValue, setDisplayValue] = useState("");

  // khi user nhập name và click => show kết quả
  const navigate = useNavigate();

  const handleSearchClick = (searchInput, e) => {
    // submit form thì cần cái này để tránh load lại
    e.preventDefault();
    // Truyền toàn bộ game object qua state
    // console.log(searchInput);
    setSearchInput("");
    setDisplayValue("");
    navigate(`/search-result`, { state: { searchInput } });
  };

  // khi user nhập name => show gợi ý ngay phía dưới
  // Sử dụng query với searchText làm tham số
  // mặc định trang để đề xuất là trang 0
  const { data: suggestions, isLoading: isLoadingSearch } =
    useGetGameSearchQuery(
      {
        searchInput,
        page: 0,
      },
      {
        skip: searchInput?.length < 3, // Chỉ gọi API khi có từ 3 ký tự
      }
    );

  // Xử lý debounce: xem note
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchInput(value);
    }, 300),
    []
  );

  const handleTrackOrder = () => {
    navigate("/user/order");
  }

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

  const handleUserInfo = () => {
    navigate("/user/account")
  }

  return (
    <header className="header">
      <div className="top-header">
        <div className="top-icons">
          <a
            href="https://www.facebook.com/kybac.ba.5/"
            target="_blank"
            className="icons"
          >
            <img src={icons.facebook} alt="Lỗi hiển thị" />
          </a>
          <a
            href="https://www.tiktok.com/@kiki_000000?_t=8rqGWTUu1y5&_r=1"
            target="_blank"
            className="icons"
          >
            <img src={icons.tiktok} alt="Lỗi hiển thị" />
          </a>
          <a
            href="https://x.com/Yiint24?t=_9kv36zTbhujLr5HxyLXAg&s=09"
            target="_blank"
            className="icons"
          >
            <img src={icons.twitter} alt="Lỗi hiển thị" />
          </a>
        </div>
        <div className="search">
          <form method="GET">
            <label htmlFor="searchInput">
              <input
                id="searchInput"
                type="text"
                name="searchInput"
                value={displayValue}
                onChange={handleInputChange}
                autoFocus
                placeholder="Bạn thích tựa game nào nhỉ ?"
              />
            </label>
            <button onClick={(e) => handleSearchClick(searchInput, e)}>
              <img src={icons.search} alt="Tìm kiếm" />
            </button>
            {/*searchInput?.length >= 3: bởi vì 3 từ trở lên mình mới gọi api
            để đề xuất, suggestions?.gameList.length > 0: có game nào đó mới hiển thị  */}
            {!isLoadingSearch &&
            searchInput.length >= 3 &&
            suggestions?.gameList.length > 0 ? (
              <SearchSuggest
                listGameSuggest={suggestions}
                setSearchInput={setSearchInput}
                setDisplayValue={setDisplayValue}
              />
            ) : (
              <></>
            )}
          </form>
        </div>

        {/* trả về những game đã mua */}
        <a style={{cursor: "pointer"}} onClick={ handleTrackOrder} className="track-order">
          Game của bạn
        </a>
      </div>
      <div className="main-header">
        <div className="logo">
          <Link to="/">
            <span
              ref={bdlvGamingRef}
              className="bdlv-gaming large grid centered square-grid text-xl"
            >
              <p>B</p>
              <p>D</p>
              <p>L</p>
              <p>V</p>
              <p>&nbsp;</p>
              <p>g</p>
              <p>a</p>
              <p>m</p>
              <p>i</p>
              <p>n</p>
              <p>g</p>
            </span>
            <img src={icons.logo} alt="logo" />
          </Link>
        </div>
        <nav className="nav-menu">
          <a href="/#list-best-seller">Game bán chạy</a>
          <a href="/#list-newest">Game mới ra mắt</a>
          <div
            className="main-header-category"
            onClick={() => setToggleCategory(!toggleCategory)}
          >
            <p>Thể loại</p>
            <img src={icons.arrowDown} alt="" />
          </div>
        </nav>
        <div className="icons">
          <div onClick={handleClickCart} className="cart">
            <img src={icons.cart} alt="Lỗi hiển thị" />
          </div>

          {user ? (
            <div onClick={() => handleUserInfo()} className="login">
              {user.email}
            </div>
          ) : (
            <div className="login" onClick={() => dispatch(setStateFormLogin(true))}>
              Đăng nhập
            </div>
          )}
        </div>
        {toggleCategory ? (
          <div className="category-detail">{category}</div>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}

export default Header;

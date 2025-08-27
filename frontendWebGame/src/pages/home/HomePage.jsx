import Category from "./category/Category";
import Banner from "./banner/Banner";
import ListGame from "./listGame/ListGame";
import { useState } from "react";

import {
  useGetGameListNewQuery,
  useGetCategoryQuery,
  useGetGameListBestSaleQuery,
} from "../../features/homeApi/homeApiSlice";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { isLoading: isLoadingNewGame, data: dataNewGame } =
    useGetGameListNewQuery(currentPage);

  const [currentPageBestSale, setCurrentPageBestSale] = useState(0);
  const { isLoading: isLoadingBestSale, data: dataBestSale } =
    useGetGameListBestSaleQuery(currentPageBestSale);

  // console.log(isLoadingBestSale, dataBestSale);
  
  // đổi tên isLoading thành isLoadingCate
  const { isLoading: isLoadingCate, data: dataCate } = useGetCategoryQuery();

  return (
    <div id="home">
      <Banner />

      <Category isLoadingCate={isLoadingCate} dataCate={dataCate} />

      <ListGame
        isLoading={isLoadingNewGame}
        listGame={dataNewGame}
        setCurrentPage={setCurrentPage}
      />
      <ListGame
        idList={"list-best-seller"}
        headerBestSeller={"Danh Sách Game Bán Chạy Nhất"}
        setCurrentPage={setCurrentPageBestSale}
        isLoading={isLoadingBestSale}
        listGame={dataBestSale}
      />
      <hr></hr>
    </div>
  );
};

export default HomePage;

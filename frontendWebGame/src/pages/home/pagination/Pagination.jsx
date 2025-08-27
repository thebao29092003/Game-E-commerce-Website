// dùng module thì css này chỉ ảnh hưởng lên component này
// trừ những global style body, html, *{}
import "./Pagination.css";
import ReactPaginate from "react-paginate";

const Pagination = (props) => {
  const { totalPage, setCurrentPage } = props;

  // Hàm đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page?.selected);
    // console.log(page)
  };


  return (
    <>
      {totalPage > 1 ? (
        <div className="container">
          <ReactPaginate
            className="pagination"
            activeClassName="activePage"
            breakLabel="..."
            nextLabel=">"
            onPageChange={(page) => handlePageChange(page)}
            pageRangeDisplayed={3}
            pageCount={totalPage}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Pagination;

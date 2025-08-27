import { useState } from "react";
import CommentForm from "./CommentForm.jsx";
import Comment from "./Comment";
import "./Comments.css";
import RatingStar from "./ratingStar/RatingStar.jsx";
import {
  useGetCommentByGameIdQuery,
  useHasUserBoughtGameQuery,
} from "../../../features/commentApi/commentApiSlice.js";
import { BounceLoader } from "react-spinners";
import Pagination from "../../home/pagination/Pagination.jsx";

const Comments = ({ game, currentUserId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  // console.log("game comment", game)

  const { isLoading, data } = useGetCommentByGameIdQuery({
    page: currentPage,
    gameId: game[0],
  });

  const { data: hasUserBoughtGame, isLoading: isLoadingHasUserBoughtGame } = useHasUserBoughtGameQuery({
    gameId: game[0],
    userId: currentUserId,
  });

  // activeComment: chứa thông tin về comment đang được chỉnh sửa.
  const [activeComment, setActiveComment] = useState(null);

  const [rating, setRating] = useState(0);

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    // other logic
  };

  console.log("rating", rating);
  // Optinal callback functions
  // const onPointerMove = (value) => setRating(value);

  return (
    <div className="comments">
      <h1 className="comments-title">Bình luận</h1>
      {hasUserBoughtGame?.hasBuyGame && !isLoadingHasUserBoughtGame ? (
        <>
          <RatingStar handleRating={handleRating} />
          <CommentForm
            submitLabel="Bình luận"
            rating={rating}
            gameId={game[0]}
            userId={currentUserId}
            currentPage={currentPage}
          />
        </>
      ) : (
        <></>
      )}

      <div className="comments-container">
        {isLoading ? (
          <BounceLoader
            color="rgb(0, 174, 215)"
            loading={true}
            cssOverride={{
              margin: "0 auto",
            }}
            size={150}
          />
        ) : (
          data?.reviewList?.map((comment, index) => (
            <Comment
              key={index}
              comment={comment}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              currentUserId={currentUserId}
              gameId={game[0]}
              currentPage={currentPage}
            />
          ))
        )}
      </div>
      <Pagination
        className="pagination"
        totalPage={data?.totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Comments;

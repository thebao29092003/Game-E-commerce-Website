import { icons } from "../../../assets/icons/icons.js";
import CommentForm from "./CommentForm.jsx";
import RatingStar from "./ratingStar/RatingStar.jsx";
import { formatDate } from "../../../utility/format/FormatDateComent.jsx";
import {
  useDeleteReviewMutation,
} from "../../../features/commentApi/commentApiSlice.js";
import { showAlert } from "../../../utility/popup/Popup.jsx";
import { detailGameApiSlice } from "../../../features/detailGameApi/detailGameApiSlice";
import { useDispatch } from "react-redux";

const Comment = ({
  // 6 props dưới all từ comments.jsx truyền xuống comment.jsx

  // dữ liệu 1 comment
  comment,

  // hàm set trạng thái (editing / replying)
  setActiveComment,

  // object đang active: { id, type }
  activeComment,

  currentUserId,
  gameId,
  currentPage,
}) => {
  // Kiểm tra xem comment hiện tại có đang được edit hoặc reply không.
  const isEditing =
    activeComment &&
    activeComment.id === comment[0] &&
    activeComment.type === "editing";

  /*
  Xoá: chỉ được nếu là chủ comment, không có reply, và trong 5 phút.
  Sửa: là chủ comment và trong 5 phút.
  Reply: chỉ cần có user đăng nhập.
  */
  // console.log("currentUserId", currentUserId)
  // console.log("comment.userId", comment[6])
  // console.log("comment", comment)
  const canDelete = currentUserId === comment[6];
  const canEdit = currentUserId === comment[6];
  const dispatch = useDispatch();

  const [triggerDeleteComment] = useDeleteReviewMutation();
  const deleteComment = async (comment) => {
    const reviewId = Number(comment[0]);
    console.log("reviewId", reviewId);

    try {
      const result = await triggerDeleteComment({
        reviewId: comment[0],
      }).unwrap(); // Thêm unwrap() để bắt lỗi

      // gọi hàm này load lại detail game vì số đánh giá đã cũ và cần cập nhật lại
      dispatch(detailGameApiSlice.util.invalidateTags([{type: "DetailGame", id: gameId}]));
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi thực hiện: ", error);
       showAlert("Thông báo !", "Có lỗi xảy ra khi thực hiện", "error");
    }
  };

  return (
    <div className="comment">
      <div className="comment-image-container">
        <img src={icons.userComment} />
      </div>
      <div className="comment-right-part">
        {/*  Thông tin người dùng: */}
        <div className="comment-content">
          <div className="comment-author">{comment[5]}</div>
          <div style={{ color: "#96a0a0" }}> {formatDate(comment[2])}</div>
        </div>
        <RatingStar
          readonly={true}
          allowHover={false}
          initialValue={comment[3]}
        />

        {/* Nội dung comment hoặc form chỉnh sửa: */}
        {!isEditing && <div className="comment-text">{comment[1]}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Sửa"
            hasCancelButton
            initialText={comment[1]}
            handleSubmit={(text) => updateComment(text, comment[0])}
            handleCancel={() => {
              setActiveComment(null);
            }}
            commentId={comment[0]}
            gameId={gameId}
            currentPage = {currentPage}
          />
        )}

        {/* Các hành động: Reply / Edit / Delete */}
        <div className="comment-actions">
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment[0], type: "editing" })
              }
            >
              Sửa
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment)}
            >
              Xóa
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;

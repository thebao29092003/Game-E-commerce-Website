import { useState } from "react";
import {
  useAddReviewMutation,
  useEditReviewMutation,
} from "../../../features/commentApi/commentApiSlice";
import { showAlert } from "../../../utility/popup/Popup";
import { useDispatch } from "react-redux";
import { detailGameApiSlice } from "../../../features/detailGameApi/detailGameApiSlice";

// Đây là một component React có tên CommentForm, dùng để nhập và gửi comment.
const CommentForm = ({
  // handleSubmit: hàm xử lý khi gửi comment.
  handleSubmit,

  // submitLabel: nội dung nút submit (ví dụ: "update", "cancel").
  submitLabel,

  // có hiển thị nút cancel hay không (mặc định là false)
  hasCancelButton = false,

  // hàm xử lý khi nhấn cancel
  handleCancel,

  // nội dung mặc định của textarea
  initialText = "",
  commentId = null,
  rating,
  gameId,
  userId,
}) => {
  // này là để add comment
  const [comment, setComment] = useState({
    comment: initialText,
    gameId: gameId,
    userId: userId,
  });

  const [triggerAddComment] = useAddReviewMutation();
  const [triggerUpdateComment] = useEditReviewMutation();
  const dispatch = useDispatch();

  console.log("submitLabel", submitLabel);

  // Kiểm tra để vô hiệu hóa nút gửi nếu không có nội dung:
  const isTextareaDisabled = comment.comment.length === 0 || rating == 0;

  // Khi người dùng submit form
  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let result = null;
      if (submitLabel === "Bình luận") {
        result = await triggerAddComment({
          ...comment,
          score: rating,
        }).unwrap(); // Thêm unwrap() để bắt lỗi

        // gọi hàm này load lại detail game vì số đánh giá đã cũ và cần cập nhật lại
        dispatch(
          detailGameApiSlice.util.invalidateTags([
            { type: "DetailGame", id: gameId },
          ])
        );
      } else if (submitLabel === "Sửa" && commentId) {
        result = await triggerUpdateComment({
          comment: comment.comment,
          score: rating,
          reviewId: commentId,
        }).unwrap(); // Thêm unwrap() để bắt lỗi
        // gọi hàm này để tắt form sửa
        handleCancel();
      }

      console.log("gameId", gameId);
      if (result) {
        // Xử lý khi thành công: reset form, hiển thị thông báo...
        setComment((prev) => ({
          ...prev,
          comment: "",
        }));
      }
    } catch (error) {
      // Xử lý lỗi từ API
      console.error("Lỗi khi thực hiện: ", error);
      showAlert("Thông báo !", "Có lỗi xảy ra khi thực hiện", "error");
    }

    // Gửi data lên API ở đây
  };
  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        value={comment.comment}
        onChange={(e) =>
          setComment((prev) => ({ ...prev, comment: e.target.value }))
        }
      />
      <button className="comment-form-button" disabled={isTextareaDisabled}>
        {submitLabel}
      </button>
      {hasCancelButton && (
        <button
          type="button"
          className="comment-form-button comment-form-cancel-button"
          onClick={handleCancel}
        >
          Hủy
        </button>
      )}
    </form>
  );
};

export default CommentForm;

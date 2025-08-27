import Swal from 'sweetalert2';
import "./Popup.css"

// Popup thông báo cơ bản
export const showAlert = (title, text, icon, confirmButtonText = 'Đồng ý', cancelButtonText = 'Hủy') => {
  return Swal.fire({
    title,
    text,
    icon, // 'success', 'error', 'warning', 'info', 'question'
    confirmButtonText,
    cancelButtonText,
    buttonsStyling: true, // Phải set true để custom style cho buttons
    customClass: {
      confirmButton: 'custom-confirm-button',
    }
  });
};

// Popup xác nhận với 2 nút OK và Cancel
export const showConfirm = (title, text, confirmButtonText = 'Đồng ý', cancelButtonText = 'Hủy') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    buttonsStyling: true, // Phải set true để custom style cho buttons
    customClass: {
      confirmButton: 'custom-confirm-button',
      cancelButton: 'custom-cancel-button',
      actions: 'custom-actions' // Class cho container chứa buttons
    }
  });
};
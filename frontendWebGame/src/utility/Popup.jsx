import Swal from 'sweetalert2';

// Popup thông báo cơ bản
export const showAlert = (title, text, icon) => {
  return Swal.fire({
    title,
    text,
    icon, // 'success', 'error', 'warning', 'info', 'question'
  });
};

// Popup xác nhận với 2 nút OK và Cancel
export const showConfirm = (title, text, confirmButtonText = 'OK', cancelButtonText = 'Cancel') => {
               return Swal.fire({
                 title,
                 text,
                 icon: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#41d4d1',
                 cancelButtonColor: '#d33',
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
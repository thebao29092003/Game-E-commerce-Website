# BDLV Gaming 🎮

## Giới thiệu

Đây là dự án web game được xây dựng với React, Redux Toolkit và Vite.

## Yêu cầu hệ thống
- Node.js >= 16.x
- npm >= 7.x (hoặc sử dụng lệnh tương đương với yarn nếu bạn dùng yarn)

## Hướng dẫn cài đặt và chạy dự án

### 1. Tải mã nguồn
Clone repository từ GitHub:
```bash
git clone https://github.com/tranthebao2003/Web-game-frontend-version2.git
cd frontendWebGame
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy ứng dụng ở chế độ phát triển
```bash
npm run dev
```
Sau đó truy cập địa chỉ được in ra (thường là http://localhost:5173).


## Cấu trúc thư mục chính
- `src/` - Chứa mã nguồn React
- `public/` - Chứa tài nguyên tĩnh
- `index.html` - File HTML gốc
- `vite.config.js` - Cấu hình Vite

## Lưu ý
- Không chỉnh sửa trực tiếp thư mục `node_modules` hoặc file trong `dist`.
- Nếu gặp lỗi về thiếu package, hãy chắc chắn đã chạy `npm install`.
- Một số tính năng yêu cầu backend hoạt động đúng API, hãy liên hệ mình nếu gặp lỗi liên quan đến dữ liệu.
- Đường dẫn src/features/urlBase.js chứa 2 đường dẫn gốc tới 2 backend springboot và flask
- Nên cài đặt 2 backend flask (cho recomment system và là proxy cho phần admin nhận game từ IGDB) và springboot backend chính

---
Mọi thắc mắc hoặc đóng góp có thể comment dưới bài đăng này hoặc nhắn tin riêng cho nick facebook mình!!!

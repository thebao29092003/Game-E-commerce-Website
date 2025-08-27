# BDLV Gaming 🎮

## Giới thiệu

Đây là backend API cho hệ thống gợi ý game, sử dụng Flask và AI content-based filtering. Chỉ cần file `api_recommend_system.py` (và các file phụ trợ đi kèm) là bạn có thể kết nối với frontend React và hệ thống quản trị Spring Boot để vận hành toàn bộ dự án.

## Tính năng chính

- Gợi ý game dựa trên nội dung (thể loại, mô tả).
- Tự động cập nhật dữ liệu từ database định kỳ.
- Tích hợp lấy thông tin game từ IGDB.
- API RESTful dễ tích hợp với các hệ thống khác.

## Yêu cầu hệ thống

- Python 3.8+
- MySQL
- Các package Python: xem ở phần cài đặt

## Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/tranthebao2003/recommen-system-web-game-version-2.git
cd recommen-system-web-game-version-2
```

### 2. Cài đặt thư viện Python

```bash
pip install -r requirements.txt
```

**Gợi ý:** Nếu chưa có file `requirements.txt`, bạn có thể tạo với nội dung:
```
Flask
flask-cors
python-dotenv
requests
pandas
sqlalchemy
pymysql
scikit-learn
schedule
```

### 3. Chuẩn bị database

- Tải và import toàn bộ folder trong link github: https://github.com/tranthebao2003/file-sql-web-game-version-2.git
- Làm theo hướng dẫn tại link github trên

### 4. Tạo file `.env`

Tạo file `.env` trong thư mục gốc với nội dung:

```
CLIENT_ID=your_igdb_client_id
CLIENT_SECRET=your_igdb_client_secret
```

#### Hướng dẫn lấy CLIENT_ID và CLIENT_SECRET từ IGDB

1. Đọc hướng dẫn tại: https://api-docs.igdb.com/#getting-started
2. Truy cập: https://dev.twitch.tv/console/apps
3. Đăng nhập bằng tài khoản Twitch.
4. Tạo ứng dụng mới (Register Your Application).
5. Điền tên, chọn loại ứng dụng (Application Type: Website), điền Redirect URL http://localhost.
6. Sau khi tạo xong, bạn sẽ thấy `Client ID` và có thể nhấn "New Secret" để lấy `Client Secret`.
7. Dán 2 giá trị này vào file `.env` như hướng dẫn trên.

### 5. Chạy API

```bash
python api_recommend_system.py
```

API sẽ chạy ở cổng 5000 (http://localhost:5000).

## Các endpoint chính

- `GET /recommend?gameName=<gameName>&gameId=<gameId>`  
  → Gợi ý 6 game tương tự dựa trên nội dung.
- `GET /add-game-igdb?gameTitle=<gameName>`  
  → Lấy thông tin game từ IGDB.

## Kết nối với React/Spring Boot

- Frontend React gọi trực tiếp các endpoint trên.
- Spring Boot có thể dùng để quản trị, cập nhật dữ liệu và tích hợp thêm các chức năng khác.

## Giới thiệu các file quan trọng

- `api_recommend_system.py`: File chính, chạy Flask API, xử lý gợi ý, truy vấn database, tích hợp IGDB.
- `fetch_access_token.py`: Lấy access token từ IGDB (Twitch API) dựa trên CLIENT_ID và CLIENT_SECRET.
- `recommend_system.py`: Script xử lý, tiền xử lý dữ liệu, train AI content-based filtering, xuất file pickle nếu cần.
- `periodic_update.py`: (Tùy chọn) Script cập nhật dữ liệu định kỳ, có thể tích hợp vào hệ thống lớn.
- `game_data_match_database.csv`: Dữ liệu mẫu để import vào file recommend_system.py để xử lý.
- `games_list.pkl`, `similarity.pkl`: (Tùy chọn) File pickle lưu trữ dữ liệu đã xử lý, có thể dùng để tăng tốc khởi động.

## Ghi chú

- Nếu muốn tự xử lý/training lại dữ liệu, hãy xem file `recommend_system.py` để biết cách chuẩn hóa, vector hóa và tính toán độ tương đồng.
- Đảm bảo database luôn đồng bộ với dữ liệu AI để gợi ý chính xác.
- Có thể mở rộng thêm collaborative filtering hoặc các thuật toán AI khác nếu muốn.

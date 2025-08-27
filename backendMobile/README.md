# BDLV Gaming 🎮

## Giới thiệu

Đây là dự án web và mobile app game được xây dựng với Spring Boot. Làm theo các hướng dẫn dưới đây để tải repository và thiết lập các dependency cần thiết để chạy ứng dụng.
Yêu Cầu Cần Thiết
Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau trên máy:

Java Development Kit (JDK): Phiên bản 17 trở lên
Maven: Phiên bản 3.6.0 trở lên
Git: Để tải repository
IDE: IntelliJ IDEA, Eclipse hoặc bất kỳ IDE nào hỗ trợ Spring Boot (khuyến nghị nhưng không bắt buộc)

Hướng Dẫn Cài Đặt
1. Tải Repository
   - Tải repository từ GitHub về máy bằng lệnh sau:
   - git clone https://github.com/tranthebao2003/Web-game-backend-version2.git

2. Di Chuyển Đến Thư Mục Dự Án
   - Chuyển đến thư mục dự án: cd Web-game-backend-version2

3. Cài Đặt Dependency
   - Dự án sử dụng Maven để quản lý dependency. 
   - Chạy lệnh sau để tải và cài đặt tất cả dependency cần thiết: mvn clean install

4. Chạy Ứng Dụng
   - Sau khi cài đặt dependency, bạn có thể chạy ứng dụng Spring Boot bằng IDE của bạn tải
   - Bạn có thể chạy trực tiếp class chính WebGameApplication (src/main/java/com.webgame.webgame).

6. Truy Cập Ứng Dụng
   - Mặc định, ứng dụng sẽ chạy tại http://localhost:8080. Mở URL này trên trình duyệt để truy cập ứng dụng.

7. Lưu Ý Bổ Sung
   - Nên tải và import những file sql trước (mình có hướng dẫn trong github: https://github.com/tranthebao2003/file-sql-web-game-version-2.git)
   - Cấu hình lại spring.datasource.url, spring.datasource.username và spring.datasource.password để phù hợp với database của bạn
   - Đảm bảo cổng 8080 không xung đột với ứng dụng khác.
   - Nếu cần, bạn có thể thay đổi cổng trong file application.properties (src/main/resources).
   - Để biết thêm cấu hình, kiểm tra file application.properties trong thư mục (src/main/resources).


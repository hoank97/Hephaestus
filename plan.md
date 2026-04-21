# Kế hoạch triển khai Astro Blog (sagarshiroya.dev Clone)

Kế hoạch này vạch ra các bước để xây dựng một website blog cá nhân bằng Astro framework với giao diện và cấu trúc tương tự trang web tham khảo của bạn.

## Mục tiêu
Tạo ra một trang web tĩnh, siêu nhanh gọn, hỗ trợ Markdown/MDX tốt nhất để viết blog, giao diện tối giản, tích hợp sẵn Dark/Light mode và dễ dàng mở rộng.

## Phân tích
Trang web `sagarshiroya.dev` dường như được xây dựng dựa trên theme mã nguồn mở rất nổi tiếng của Astro là **AstroPaper**. Để tiết kiệm tối đa thời gian và đạt hiệu quả giống hệ thống gốc, tôi đề xuất chúng ta **clone trực tiếp từ template AstroPaper** thay vì build mọi thứ lại từ đầu.

## Các bước triển khai

### 1. Khởi tạo & Cài đặt môi trường 
- Khởi tạo dự án Astro bằng lệnh khởi tạo tự động.
- Cấu hình template blog tiêu chuẩn.
- Dọn dẹp các bài viết/nội dung demo có sẵn.

### 2. Thiết lập Cấu trúc Content Collections
- Định nghĩa lại Schema (Zod) cho blog tại `src/content/config.ts`.
- Đảm bảo đầy đủ các trường (title, pubDate, description, tags, v.v.).

### 3. Tùy chỉnh Giao diện (UI) & Styles
- Cấu hình Tailwind CSS, tinh chỉnh màu sắc giống trang tham khảo.
- Cập nhật Logo, Menu Header, Social links ở Footer.

### 4. Xây dựng trang tính năng (Pages)
- **Home (`/`)**: Các bài nổi bật, các bài gần nhất.
- **Posts (`/posts`)**: Phân trang bài viết.
- **Tags (`/tags`)**: Quản lý thẻ tag mượt mà.
- **About/Archives/Search**: Cấu hình trang About, trang Lưu trữ và màn hình Tìm Kiếm Fuse.js.

### 5. Cấu hình SEO 
- Cập nhật thông tin tác giả, Google Analytics/Vercel Analytics nếu cần.
- Bật sitemap và generate RSS feed mặc định.

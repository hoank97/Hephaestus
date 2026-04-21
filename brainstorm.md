# Brainstorming: Study Website (Blog)

## 🎯 Mục tiêu dự án
Xây dựng một trang web cá nhân chuyên dùng để xuất bản các bài viết blog, chia sẻ kiến thức, lưu trữ tài liệu học tập. Giao diện được lấy cảm hứng từ [sagarshiroya.dev](https://sagarshiroya.dev/), chú trọng vào sự tối giản, tốc độ tải trang nhanh và trải nghiệm đọc tốt nhất.

## 🛠 Tech Stack (Công nghệ sử dụng)
- **Framework:** [Astro](https://astro.build/) - Framework tối ưu cho các trang web thiên về nội dung tĩnh (như blog) với kiến trúc "Islands".
- **Styling:** Tailwind CSS - Để styling nhanh, giao diện có hỗ trợ sẵn Dark/Light mode chuẩn.
- **Ngôn ngữ:** TypeScript & Markdown (hoặc MDX).
- **Theme gợi ý:** [AstroPaper](https://astro.paper.tech/) (Trang web mẫu sagarshiroya.dev có cấu trúc và tính năng y hệt template này, do đó việc tuỳ chỉnh từ AstroPaper sẽ tiết kiệm 90% thời gian thiết kế cấu trúc).

## 📑 Cấu trúc trang (Pages)
1. **Home (`/`)**: 
   - Lời giới thiệu ngắn gọn (Hero section).
   - Danh sách "Featured Posts" (Bài viết nổi bật).
   - Danh sách "Recent Posts" (Bài viết gần đây).
2. **Posts (`/posts`)**: Tất cả bài viết, có phân trang (pagination).
3. **Tags (`/tags`)**: Phân loại bài viết theo chủ đề/thẻ.
4. **About (`/about`)**: Giới thiệu bản thân, mục tiêu, kết nối.
5. **Archives (`/archives`)**: Lưu trữ các bài viết theo năm/tháng.
6. **Search (`/search`)**: Tìm kiếm bài viết (sử dụng library như Fuse.js).

## ✨ Tính năng cốt lõi (Core Features)
- **Quản lý nội dung (Content Collections):** Sử dụng `src/content/blog` của Astro để viết blog bằng file `.md` hoặc `.mdx` với tính năng type-check an toàn.
- **Dark/Light Mode Toggle:** Hỗ trợ chuyển đổi chế độ giao diện tùy theo sở thích người đọc.
- **Responsive Design:** Hiển thị hoàn hảo trên cả máy tính lẫn điện thoại.
- **SEO & Hiệu suất:** 
  - Điểm Lighthouse 100/100.
  - Tự động sinh thẻ Meta (Open Graph, Twitter).
  - Tự động sinh `sitemap.xml` và RSS Feed.
- **Đọc code (Syntax Highlighting):** Rất cần thiết cho blog học tập, hiển thị code block rõ ràng, đẹp mắt.

## 🎨 Giao diện & Trải nghiệm (UI/UX)
- **Typography:** Rõ ràng, dễ đọc, kích thước chữ tối ưu cho văn bản dài (có thể dùng font sans-serif như Inter hoặc Roboto).
- **Màu sắc:** Nền trắng (sáng) hoặc đen/xám đậm (tối), màu nhấn (accent color) tối giản.
- **Tương tác:** Hover effect nhẹ nhàng, không lạm dụng animation để giữ tốc độ trang siêu nhanh.

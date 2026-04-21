# 🚀 HoanK's Study Website (Astro Blog)

[![Built with Astro](https://img.shields.io/badge/Built_with-Astro-ff5a03?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Đây là kho lưu trữ mã nguồn cho Website/Blog cá nhân của mình, phục vụ mục đích ghi chép hành trình học tập, quản lý kho tàng kiến thức (Knowledge Base) và chia sẻ bài viết liên quan đến lập trình.

Dự án được xây dựng với kiến trúc tĩnh (Static Site Generation), không sử dụng Javascript thừa (zero-JS) ở Client-side, mang lại điểm số Lighthouse tối đa để đảm bảo khả năng tối ưu hóa (SEO) hoàn chỉnh.

## 🌟 Các tính năng nổi bật
* **Tuyệt đối nhanh:** Sử dụng kiến trúc "Astro Islands".
* **Giao diện thân thiện:** Tích hợp Dark / Light mode siêu mượt.
* **Trải nghiệm đọc tốt nhất:** Content typography được tối ưu với Tailwind, cú pháp đọc Markdown & MDX native.
* **Tìm kiếm nội dung siêu việt:** Hệ thống full-text search mạnh mẽ tại nhánh Client thông qua cấu hình `Pagefind`.
* **Phân trang & Tag:** Xây dựng logic phân trang động và gom nhóm thẻ (Tags).
* **Bảo mật và SEO:** Tự động gen RSS feed (`/rss.xml`) và `Sitemap`.


## 📁 Cấu trúc thư mục (Folder Structure)

Bên trong hệ thống này, source code phân định rành mạch giữa Cấu hình hệ thống và Quản lý dữ liệu.

```text
/
├── public/                 # Các resources tĩnh (font, hình ảnh favicon...)
├── src/
│   ├── assets/             # Hình ảnh sẽ được build tối ưu thông qua Image service.
│   ├── components/         # Các mảnh giao diện UI có thể tái sử dụng.
│   ├── data/
│   │   └── blog/           # ❤️ NƠI LƯU TRỮ TOÀN BỘ CÁC BÀI VIẾT .MD / .MDX
│   ├── layouts/            # Layout chính của website.
│   ├── pages/              # Khai báo các Routes chính của trang (Home, About, Post,...).
│   ├── styles/             # Cấu hình Tailwind global.
│   ├── config.ts           # Thay đổi tiêu đề, mô tả hoặc logo của website.
│   └── content.config.ts   # Định nghĩa Zod schema cho blog collection.
└── package.json
```

## 🛠 Hướng dẫn Cài đặt & Chạy Local

Bạn cần có môi trường **Node.js** (Phiên bản `v18.14.0` trở lên, khuyến nghị `v22+`).
1. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
2. Chạy Server tại môi trường Development:
   ```bash
   npm run dev
   ```
   *Terminal sẽ hiện ra đường link dẫn tới website (Mặc định ở `http://localhost:4321/`)*

## ✍️ Hướng dẫn Đăng bài mới

Toàn bộ các bài đăng của hệ thống ở định dạng `.md` hoặc `.mdx` nằm trong directory `src/data/blog/`. \
Để tạo mới bài viết, hãy tạo 1 tệp tin `.md` và thêm block Frontmatter như sau lên phần đầu file:

```yaml
---
title: "Tiêu đề bài viết của bạn"
pubDatetime: 2026-04-21T07:30:00Z
description: "Mô tả ngắn hiển thị ở trang chủ"
author: "Hoan K"
tags:
  - "học.tập"
  - "công.nghệ"
featured: true   # Nếu true, bài viết sẽ nằm ở mục "Nổi Bật / Featured".
draft: false     # Đặt là true nếu bài này là bản nháp (Chưa public).
---

Nội dung bài viết bắt đầu từ đây... Bạn hoàn toàn có thể viết text, chèn `code`, hình ảnh.
```

## 📜 Các Lệnh Khác (Commands)

| Command | Action |
| :--- | :--- |
| `npm run dev` | Bật local dev server chạy ở `localhost:4321` |
| `npm run build` | Build trang ở dạng production vào thư mục `dist/` |
| `npm run preview` | Giả lập chạy thử thư mục build locally trươc khi publish |
| `npm run format` | Dọn dẹp code style format tự động bằng Prettier|
| `npm run lint` | Chạy bộ linter của Eslint bắt lỗi trong dự án |

---
*Giao diện dự án được phát triển dựa trên [AstroPaper Theme](https://astro.paper.tech/).* 

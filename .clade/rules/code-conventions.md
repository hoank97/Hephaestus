# Code Conventions

## General
- Ưu tiên chỉnh file hiện có thay vì tạo abstraction mới không cần thiết.
- Giữ code đơn giản, tránh thêm logic phòng thủ không cần thiết.
- Mặc định không thêm comments trừ khi cần giải thích ràng buộc khó thấy.

## Astro + TS
- Routing theo file-based routing trong `src/pages/`.
- Components tái sử dụng trong `src/components/`.
- Layouts trong `src/layouts/`.
- Utilities trong `src/utils/`.

## Content
- Content collections định nghĩa trong `src/content.config.ts`.
- Blog nằm ở `src/data/blog/`.
- Questions nằm ở `src/data/questions/`.

## Styling
- Ưu tiên Tailwind utility classes.
- Typography cho content dài dùng `app-prose`.

## Validation
- Sau thay đổi, luôn chạy `npm run build`.

# Data Flow

## Collections
- `blog` collection: load từ `src/data/blog`
- `questions` collection: load từ `src/data/questions`
- Schema validate tại `src/content.config.ts`

## Render flow
1. Markdown files được load qua Astro content loader.
2. Frontmatter được validate bằng zod schema.
3. Pages (`src/pages/...`) gọi `getCollection()` để render list/detail.
4. Tag pages tổng hợp nội dung theo tag.

## Tag behavior
- `/tags` hiển thị tags từ cả blog + questions.
- `/tags/[tag]` hiển thị nội dung liên quan theo tag.

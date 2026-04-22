# Content Generation Rules (Blog & Questions)

## Source of truth
- Schema luôn bám theo `src/content.config.ts`.
- Paths hiện tại:
  - Blog: `src/data/blog/*.md`
  - Questions: `src/data/questions/*.md`

## Blog frontmatter
### Required
- `title` (string)
- `description` (string)
- `pubDatetime` (ISO 8601 UTC)
- `tags` (string[])

### Recommended
- `author`
- `featured`
- `draft`

### Optional
- `modDatetime`
- `ogImage`
- `canonicalURL`
- `hideEditPost`
- `timezone`

## Questions frontmatter
### Required
- `question` (string)
- `answer` (string)
- `pubDatetime` (ISO 8601 UTC)

### Recommended
- `tags` (string[])
- `featured`

## Conventions
- Dùng datetime UTC, ví dụ: `2026-04-22T00:00:00Z`.
- Tags ưu tiên lowercase + kebab-case.
- `question` là title ở list/detail; `answer` là phần trả lời ngắn chính; markdown body là mở rộng.

## Templates
### Blog
```md
---
title: "Your blog title"
pubDatetime: 2026-04-22T00:00:00Z
description: "One or two concise sentences describing the post."
author: "Hoan K"
tags:
  - "system-design"
  - "architecture"
featured: false
draft: false
---

Your blog content here.
```

### Question
```md
---
question: "Your question here?"
answer: "Short direct answer here."
tags: ["tag-1", "tag-2"]
pubDatetime: 2026-04-22T00:00:00Z
featured: false
---

Optional extended explanation in markdown.
```

## Verification checklist
- Chạy `npm run build`
- Verify:
  - `/posts` hiển thị blog mới
  - `/questions` hiển thị question mới và vào detail được
  - `/tags` có tags từ cả posts và questions
  - `/tags/<tag>` không 404

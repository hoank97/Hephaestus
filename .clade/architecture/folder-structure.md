# Folder Structure

```text
src/
  assets/         # Icons/images
  components/     # Reusable UI components
  data/
    blog/         # Blog markdown files
    questions/    # Questions markdown files
  layouts/        # Page layouts
  pages/          # Astro routes
  styles/         # Global styles/typography
  utils/          # Helper functions
  content.config.ts  # Collection schemas
```

## Routing notes
- Blog list/detail: `/posts`, `/posts/[slug]`
- Questions list/detail: `/questions`, `/questions/[slug]`
- Tags: `/tags`, `/tags/[tag]`

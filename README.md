# Saad Chaudry Portfolio

Static portfolio site for GitHub Pages. The site highlights selected full-stack, backend, AI, and simulation projects with project screenshots, rotating project cards, and a modal photo viewer.

## Structure

- `index.html` contains the page markup and main content sections.
- `styles.css` contains all layout, responsive, carousel, and modal styling.
- `script.js` contains project data, stack data, carousel behavior, photo rotation, and the lightbox modal.
- `public/` stores project screenshots and static assets.
- `favicon.svg` is the browser tab icon.

## Editing Projects

Projects are defined in `script.js` inside the `projects` array.

```js
{
  title: "Project Name",
  description: "Short project summary.",
  image: "",
  images: [
    "public/project/screenshot-1.png",
    "public/project/screenshot-2.png",
  ],
  liveUrl: "https://example.com",
  githubUrl: "https://github.com/user/repo",
  tags: ["React", "FastAPI", "PostgreSQL"],
}
```

Use `images` for multiple screenshots. The project card rotates through those screenshots automatically, and clicking a screenshot opens the modal viewer.

## Editing Stack

The stack chips are defined at the top of `script.js`:

```js
const stack = ["Next.js", "TypeScript", "FastAPI"];
```

## Local Preview

Because this is a static site, any local static server works.

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

This repository is intended for GitHub Pages. Push changes to the configured Pages branch, and GitHub Pages will serve the static files directly.

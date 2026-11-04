# siyaspathare.github.io

Siya's art portfolio. Live at **https://siyaspathare.github.io**.

Every change pushed to `main` rebuilds and publishes the site automatically (about 2 minutes). Check progress on the repo's **Actions** tab.

## Add a new artwork (no coding needed)

1. On GitHub, open the folder `src/content/works/`.
2. Click **Add file → Upload files** and upload your image (JPG or PNG, up to 25 MB). Use a simple file name with no spaces, e.g. `dream-cat.jpeg`.
3. Click **Add file → Create new file**, name it the same as the image but ending in `.md` (e.g. `dream-cat.md`), and paste:

   ```yaml
   ---
   title: "Dream Cat"
   image: ./dream-cat.jpeg
   category: illustration
   ---
   ```

4. Click **Commit changes**. Done!

You don't need to resize or compress anything. The site does that for you.

### Optional extras for an artwork

```yaml
year: 2026
medium: "Acrylic on canvas"
featured: true   # shows it in the big hero at the top (the first 3 featured are used)
order: 1         # lower numbers appear first in the gallery
```

### Categories

Use one of: `illustration`, `character-design`, `graphic-design`.
Filter buttons only appear for categories that have at least one artwork.
To add a new category, edit `src/lib/categories.ts`.

### Remove or hide an artwork

Delete both its image and its `.md` file.

## Edit About / CV

- **About page + footer links:** `src/content/pages/about.md`. Edit the bio text, and remove the `#` in front of `email`, `instagram`, etc. to show them.
  To add a photo, upload it to `src/content/pages/` and uncomment the `photo:` line.
- **CV page:** `src/content/pages/cv.md`. To offer a PDF download, upload `siya-cv.pdf` into the `public/` folder and uncomment `cvPdf:`.

If something you wrote has a typo (like an unknown category), the build fails and the old site stays up. The Actions tab will show a red ✗ with the reason.

## Run locally (for developers)

Needs Node 22.23+.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

Built with [Astro](https://astro.build), [GSAP](https://gsap.com), [Lenis](https://lenis.darkroom.engineering) and [PhotoSwipe](https://photoswipe.com).

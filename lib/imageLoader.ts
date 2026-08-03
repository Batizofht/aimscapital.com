/**
 * Custom next/image loader.
 *
 * The site is a fully static export (`output: "export"`), so there is no
 * Next.js image-optimization server. Instead, for images served by our own
 * backend (anything under /uploads/), we delegate optimization to the backend's
 * on-the-fly resizer (see server/middlewares/imageResize.ts), which returns a
 * correctly-sized, high-quality WebP.
 *
 * next/image still does its job on the front-end: generating responsive
 * `srcset` entries and lazy-loading — it just points each entry at our backend.
 *
 * Local/static assets (e.g. /images/hero.jpg) and any non-/uploads URL are
 * returned unchanged: those are served by the static host as-is.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Only our backend-hosted uploads can be resized on the fly.
  if (src.includes("/uploads/")) {
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}w=${width}&q=${quality || 82}`;
  }
  return src;
}

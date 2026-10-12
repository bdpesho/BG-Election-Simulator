// Title-screen sprite URLs for the Vite build.
// title-bg.js loads its sprites at runtime by path, which Vite cannot see, so a production
// build shipped without them and the title screen fell back to placeholder art.
// import.meta.glob makes Vite copy/fingerprint the PNGs and hands back their final URLs.
// When the page is served unbundled, import.meta.glob doesn't exist; the call throws, we
// catch it, and title-bg.js falls back to its plain relative paths.
const urls = {};
try {
  const files = import.meta.glob("./assets/sprites/*.png", { eager: true, query: "?url", import: "default" });
  for (const path in files) {
    const name = path.split("/").pop().replace(/\.png$/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    urls[name] = files[path];
  }
} catch (_) { /* unbundled: keep relative paths */ }
window.__TITLE_SPRITE_URLS = urls;

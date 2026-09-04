---
"sheer-ui": minor
---

Sidebar: the viewport is read from the desktop panel's CSS display instead of a JS media query; both surfaces render on every viewport and the content renders once. `useSidebar()` drops `openForViewport` and gains `sheetOpen`, `closeSheet` and `desktopPanels`; `Sidebar.Root`'s `ref` is always the desktop panel.

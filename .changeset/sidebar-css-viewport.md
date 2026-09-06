---
"sheer-ui": minor
---

Sidebar: the viewport is read from the desktop panel's CSS display instead of a JS media query; both surfaces render on every viewport and the content renders once. `useSidebar()` drops `openForViewport` and gains `sheetOpen`, `closeSheet` and `desktopPanels`; `Sidebar.Root`'s `ref` is always the desktop panel. The panel and its `data-state` / `data-collapsible` attributes are in the DOM below `md` too, only hidden by CSS, so a `:has()` or `peer` rule keyed on them (shadcn's `group-has-data-[collapsible=icon]/sidebar-wrapper:h-12` header) now matches on a phone and wants an `md:` prefix. A sheet left open while widening closes and stays closed when narrowing again.

# sheer-ui

## 0.3.0

### Minor Changes

- [#95](https://github.com/polumeyv/sheer-ui/pull/95) [`afa57b3`](https://github.com/polumeyv/sheer-ui/commit/afa57b31702c818a7253bef844d6ca86c7cc6a4b) Thanks [@Nic-Polumeyv](https://github.com/Nic-Polumeyv)! - Toggle-group and toolbar group share one selection engine instead of mirrored single and multiple state classes. A `value` bound to `undefined` after mount is repaired to the mode's empty selection, as Select's is.

## 0.2.0

### Minor Changes

- [#92](https://github.com/polumeyv/sheer-ui/pull/92) [`224049c`](https://github.com/polumeyv/sheer-ui/commit/224049cbf94b13effff32ab600a3a70cab4dff7c) Thanks [@Nic-Polumeyv](https://github.com/Nic-Polumeyv)! - Menu checkbox items keep the menu open after a toggle; plain and radio items close it. The `closeOnSelect` prop is gone: `event.preventDefault()` in `onSelect` keeps an item from closing while the toggle or selection still happens, and writing `open` on the cell the root's children snippet receives closes it. The unread `textValue` item prop is gone. A data-table column's `isVisible` is a settable property that consumers `bind:checked` to; `toggleVisibility` is gone.

- [#91](https://github.com/polumeyv/sheer-ui/pull/91) [`ccde7be`](https://github.com/polumeyv/sheer-ui/commit/ccde7be5f38861e2c6b863e972d1d7c428ee2b16) Thanks [@Nic-Polumeyv](https://github.com/Nic-Polumeyv)! - Sidebar: the viewport is read from the desktop panel's CSS display instead of a JS media query; both surfaces render on every viewport and the content renders once. `useSidebar()` drops `openForViewport` and gains `sheetOpen`, `closeSheet` and `desktopPanels`; `Sidebar.Root`'s `ref` is always the desktop panel. The panel and its `data-state` / `data-collapsible` attributes are in the DOM below `md` too, only hidden by CSS, so a `:has()` or `peer` rule keyed on them (shadcn's `group-has-data-[collapsible=icon]/sidebar-wrapper:h-12` header) now matches on a phone and wants an `md:` prefix. A sheet left open while widening closes and stays closed when narrowing again.

### Patch Changes

- [#94](https://github.com/polumeyv/sheer-ui/pull/94) [`35db768`](https://github.com/polumeyv/sheer-ui/commit/35db7683342fab365cfe85c324f1c836dd5025d7) Thanks [@Nic-Polumeyv](https://github.com/Nic-Polumeyv)! - A menu item's pointer-down flag resets on pointer-up, so a press started on the trigger and released on an item that was clicked earlier in the same page still selects it. A keyboard select that keeps the menu open no longer leaves keyboard mode, so the highlight stays put when the pointer drifts.

## 0.1.0

### Minor Changes

- [#87](https://github.com/polumeyv/sheer-ui/pull/87) [`1f8f98d`](https://github.com/polumeyv/sheer-ui/commit/1f8f98dc4037a5a689494088912923fc1c9aa309) Thanks [@Nic-Polumeyv](https://github.com/Nic-Polumeyv)! - The package is `sheer-ui` and publishes to npm. It was `@polumeyv/ui`, private, consumed only as workspace source.

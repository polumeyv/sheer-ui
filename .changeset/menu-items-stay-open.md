---
'sheer-ui': minor
---

Menu checkbox items keep the menu open after a toggle; plain and radio items close it. The `closeOnSelect` prop is gone: `event.preventDefault()` in `onSelect` keeps an item from closing while the toggle or selection still happens, and writing `open` on the cell the root's children snippet receives closes it. The unread `textValue` item prop is gone. A data-table column's `isVisible` is a settable property that consumers `bind:checked` to; `toggleVisibility` is gone.

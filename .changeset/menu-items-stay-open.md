---
'sheer-ui': minor
---

Menu checkbox and radio items keep the menu open after a toggle; plain items close it. The `closeOnSelect` prop is gone, close through `bind:open` instead. A data-table column's `isVisible` is a settable property that consumers `bind:checked` to; `toggleVisibility` is gone.

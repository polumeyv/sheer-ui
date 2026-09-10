---
'sheer-ui': patch
---

Accordion runs on the shared selection engine: single/multiple mode is fixed at mount, and `bind:value` without an initial value no longer throws; it repairs to the mode's empty selection, like ToggleGroup. Public props are unchanged.

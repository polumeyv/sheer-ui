---
'sheer-ui': patch
---

A menu item's pointer-down flag resets on pointer-up, so a press started on the trigger and released on an item that was clicked earlier in the same page still selects it. A keyboard select that keeps the menu open no longer leaves keyboard mode, so the highlight stays put when the pointer drifts.

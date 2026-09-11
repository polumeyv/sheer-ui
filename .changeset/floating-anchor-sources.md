---
'sheer-ui': patch
---

Floating anchors are read through getters instead of boxes: the trigger attachment, `customAnchor`, and the context menu's pointer rect each hand the floating root a function, and the context menu's virtual anchor is one stable object whose rect tracks the pointer. `simpleBox` is gone. No public change.

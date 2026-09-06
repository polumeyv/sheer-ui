---
'sheer-ui': minor
---

Toggle-group and toolbar group share one selection engine instead of mirrored single and multiple state classes. A `value` bound to `undefined` after mount is repaired to the mode's empty selection, as Select's is.

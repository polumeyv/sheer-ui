---
'sheer-ui': patch
---

ToggleGroup and Toolbar.Group engines take their options as one accessor object over the component's props instead of per-prop boxes; the shared selection item does the same. No public change.

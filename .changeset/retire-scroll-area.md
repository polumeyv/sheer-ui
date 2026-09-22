---
'sheer-ui': minor
---

breaking: `ScrollArea` is a native scroller (`scrollbar-color`, `scrollbar-width`, `scrollend`); `type`, `scrollHideDelay` and `orientation` stay, while `Viewport`, `Scrollbar`, `Thumb`, `Corner`, `viewportRef` and the scrollbar class props are gone. Children are laid out by the scroller itself, with no content wrapper between. The content props that native Popover, Tooltip, LinkPreview, Dialog and Sheet ignored are removed.

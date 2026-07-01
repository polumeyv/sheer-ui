import Handle from './resizable-handle.svelte';
import PaneGroup from './resizable-pane-group.svelte';
import { Pane } from './paneforge/index.js';

export {
	PaneGroup,
	Pane,
	Handle,
	//
	PaneGroup as ResizablePaneGroup,
	Pane as ResizablePane,
	Handle as ResizableHandle,
};

export type { PaneGroupProps, PaneProps, PaneResizerProps } from './paneforge/index.js';

<script lang="ts">
	import * as ResizablePrimitive from './paneforge/index.js';
	import { join } from 'overrule';

	let {
		ref = $bindable(null),
		this: paneGroup = $bindable(),
		class: className,
		...restProps
	}: ResizablePrimitive.PaneGroupProps & {
		this?: ResizablePrimitive.PaneGroup;
	} = $props();
</script>

<ResizablePrimitive.PaneGroup
	bind:this={paneGroup}
	data-slot="resizable-pane-group"
	class={join('flex h-full w-full data-[direction=vertical]:flex-col', className)}
	{...restProps} />

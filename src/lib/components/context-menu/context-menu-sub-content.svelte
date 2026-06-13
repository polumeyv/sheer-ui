<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from '$lib/bits-ui.js';
	import { cn } from '../../utils';

	let { ref = $bindable(null), class: className, ...restProps }: ContextMenuPrimitive.SubContentProps = $props();
</script>

<ContextMenuPrimitive.SubContent
	bind:ref
	data-slot="context-menu-sub-content"
	class={cn(
		'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 min-w-[8rem] origin-(--bits-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
		className,
	)}
	{...restProps} />

<script lang="ts">
	import { LinkPreview as HoverCardPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '../../utils';
	import HoverCardPortal from './hover-card-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		align = 'center',
		sideOffset = 4,
		portalProps,
		...restProps
	}: HoverCardPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof HoverCardPortal>>;
	} = $props();
</script>

<HoverCardPortal {...portalProps}>
	<HoverCardPrimitive.Content
		bind:ref
		data-slot="hover-card-content"
		{align}
		{sideOffset}
		class={cn(
			'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 mt-3 w-64 rounded-md border p-4 shadow-md outline-none',
			className,
		)}
		{...restProps} />
</HoverCardPortal>

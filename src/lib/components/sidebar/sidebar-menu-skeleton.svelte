<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import { Skeleton } from '../skeleton/index.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		showIcon = false,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		showIcon?: boolean;
	} = $props();

	const uid = $props.id();
	// Pseudo-random width between 50% and 90%, derived from the SSR-stable instance id
	// (Math.random here would mismatch between server render and hydration).
	const width = `${50 + (parseInt(uid.replace(/\D/g, '') || '0', 10) * 7) % 41}%`;
</script>

<div
	bind:this={ref}
	data-slot="sidebar-menu-skeleton"
	data-sidebar="menu-skeleton"
	class={join('h-8 gap-2 rounded-md px-2 flex items-center', className)}
	{...restProps}>
	{#if showIcon}
		<Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
	{/if}
	<Skeleton class="h-4 max-w-(--skeleton-width) flex-1" data-sidebar="menu-skeleton-text" style="--skeleton-width: {width};" />
	{@render children?.()}
</div>

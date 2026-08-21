<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';

	import type { NavigationMenuViewportProps } from '../types.js';
	import { NavigationMenuViewportState } from '../navigation-menu.svelte.js';

	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		child,
		children,
		...restProps
	}: NavigationMenuViewportProps & {
		class?: ClassValue;
	} = $props();

	const viewportState = NavigationMenuViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const viewportClass = $derived(
		join(
			'origin-top-center relative mt-1.5 h-[calc(var(--bits-navigation-menu-viewport-height)+1rem)] w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 transition-[scale,display] transition-discrete duration-100 data-closed:scale-90 data-closed:hidden starting:data-open:scale-90 md:w-[calc(var(--bits-navigation-menu-viewport-width)+1rem)]',
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'navigation-menu-viewport',
				class: viewportClass,
			},
			viewportState.props,
		),
	);
</script>

<div class="absolute inset-s-0 top-full isolate z-50 flex justify-center">
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>

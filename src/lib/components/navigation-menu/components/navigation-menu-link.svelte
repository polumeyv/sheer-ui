<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';

	import type { NavigationMenuLinkProps } from '../types.js';
	import { NavigationMenuLinkState } from '../navigation-menu.svelte.js';

	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		child,
		children,
		active = false,
		onSelect = () => {},
		tabindex = 0,
		...restProps
	}: NavigationMenuLinkProps & {
		class?: ClassValue;
	} = $props();

	const linkState = NavigationMenuLinkState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
		active: boxWith(() => active),
		onSelect: boxWith(() => onSelect),
	});

	const linkClass = $derived(
		join(
			"flex items-center gap-1.5 rounded-md p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-sm data-[active=true]:bg-muted/50 data-[active=true]:hover:bg-muted data-[active=true]:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'navigation-menu-link',
				class: linkClass,
			},
			linkState.props,
			{ tabindex },
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.()}
	</a>
{/if}

<script lang="ts">
	import { join } from 'overrule';
	import { boxWith, mountedAttachment } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';

	import type { NavigationMenuListProps } from '../types.js';
	import { NavigationMenuListState } from '../navigation-menu.svelte.js';

	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		children,
		child,
		...restProps
	}: NavigationMenuListProps & {
		class?: string;
	} = $props();

	const listState = NavigationMenuListState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const listClass = $derived(join('group flex flex-1 list-none items-center justify-center gap-0', className));

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'navigation-menu-list',
				class: listClass,
			},
			listState.props,
		),
	);

	const mounted = mountedAttachment<HTMLElement>((m) => (listState.wrapperMounted = m));

	const wrapperProps = $derived(mergeProps(listState.wrapperProps, mounted));
</script>

{#if child}
	{@render child({ props: mergedProps, wrapperProps })}
{:else}
	<div {...wrapperProps}>
		<ul {...mergedProps}>
			{@render children?.()}
		</ul>
	</div>
{/if}

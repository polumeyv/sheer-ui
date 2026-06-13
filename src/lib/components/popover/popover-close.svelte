<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { PopoverCloseProps } from '$lib/bits/popover/types.js';
	import { PopoverCloseState } from '$lib/bits/popover/popover.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: PopoverCloseProps = $props();

	const closeState = PopoverCloseState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'popover-close' }, restProps, closeState.props),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

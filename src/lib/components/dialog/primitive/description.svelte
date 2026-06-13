<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import { DialogDescriptionState } from '$lib/components/dialog/primitive/dialog.svelte.js';
	import type { DialogDescriptionProps } from '$lib/components/dialog/primitive/index.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: DialogDescriptionProps = $props();

	const descriptionState = DialogDescriptionState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, descriptionState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

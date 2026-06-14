<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { DialogCloseState } from '$lib/components/primitive/dialog/dialog.svelte';
	import type { DialogCloseProps } from '$lib/components/primitive/dialog/index';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		disabled = false,
		...restProps
	}: DialogCloseProps = $props();

	const closeState = DialogCloseState.create({
		variant: { get current() { return 'close' as const; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

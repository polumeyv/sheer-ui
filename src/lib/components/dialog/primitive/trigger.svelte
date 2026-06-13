<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import { DialogTriggerState } from '$lib/components/dialog/primitive/dialog.svelte.js';
	import type { DialogTriggerProps } from '$lib/components/dialog/primitive/index.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		...restProps
	}: DialogTriggerProps = $props();

	const triggerState = DialogTriggerState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

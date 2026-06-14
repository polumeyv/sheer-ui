<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { DialogTriggerState } from "$lib/components/dialog/primitive/dialog.svelte";
	import type { DialogTriggerProps } from "$lib/components/dialog/primitive/index";
	import { createId } from "$lib/vendor/create-id";

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

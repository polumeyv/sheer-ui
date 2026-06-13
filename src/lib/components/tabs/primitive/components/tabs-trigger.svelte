<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { TabsTriggerProps } from "$lib/components/tabs/primitive/index.js";
	import { TabsTriggerState } from "$lib/components/tabs/primitive/tabs.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		disabled = false,
		id = createId(uid),
		type = "button",
		value,
		ref = $bindable(null),
		...restProps
	}: TabsTriggerProps = $props();

	const triggerState = TabsTriggerState.create({
		id: {
			get current() {
				return id;
			},
		},
		disabled: {
			get current() {
				return disabled ?? false;
			},
		},
		value: {
			get current() {
				return value;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

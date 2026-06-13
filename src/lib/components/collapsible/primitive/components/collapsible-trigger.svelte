<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { CollapsibleTriggerProps } from "$lib/components/collapsible/primitive/index.js";
	import { CollapsibleTriggerState } from "$lib/components/collapsible/primitive/collapsible.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		...restProps
	}: CollapsibleTriggerProps = $props();

	const triggerState = CollapsibleTriggerState.create({
		id: {
			get current() {
				return id;
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
		disabled: {
			get current() {
				return disabled;
			},
		},
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

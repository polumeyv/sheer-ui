<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { CollapsibleTriggerProps } from '$lib/components/primitive/collapsible/index';
	import { CollapsibleTriggerState } from '$lib/components/primitive/collapsible/collapsible.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let { children, child, ref = $bindable(null), id = createId(uid), disabled = false, ...restProps }: CollapsibleTriggerProps = $props();

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

	const mergedProps = $derived(mergeProps({ 'data-slot': 'collapsible-trigger' }, restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

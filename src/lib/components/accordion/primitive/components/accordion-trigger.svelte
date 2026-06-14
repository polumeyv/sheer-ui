<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { AccordionTriggerProps } from '$lib/components/accordion/primitive/index';
	import { AccordionTriggerState } from '$lib/components/accordion/primitive/accordion.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		disabled = false,
		ref = $bindable(null),
		id = createId(uid),
		tabindex = 0,
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const triggerState = AccordionTriggerState.create({
		disabled: {
			get current() {
				return disabled;
			},
		},
		id: {
			get current() {
				return id;
			},
		},
		tabindex: {
			get current() {
				return tabindex ?? 0;
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

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

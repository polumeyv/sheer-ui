<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { TabsTriggerProps } from '$lib/components/tabs/primitive/index';
	import { TabsTriggerState } from '$lib/components/tabs/primitive/tabs.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		child,
		children,
		disabled = false,
		id = createId(uid),
		type = 'button',
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

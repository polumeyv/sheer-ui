<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { TabsContentProps } from '$lib/components/tabs/primitive/index';
	import { TabsContentState } from '$lib/components/tabs/primitive/tabs.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let { children, child, id = createId(uid), ref = $bindable(null), value, ...restProps }: TabsContentProps = $props();

	const contentState = TabsContentState.create({
		value: {
			get current() {
				return value;
			},
		},
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
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

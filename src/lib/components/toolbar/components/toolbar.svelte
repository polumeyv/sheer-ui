<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { ToolbarRootProps } from '$lib/components/toolbar/index';
	import { ToolbarRootState } from '$lib/components/toolbar/toolbar.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		orientation = 'horizontal',
		loop = true,
		child,
		children,
		...restProps
	}: ToolbarRootProps = $props();

	const rootState = ToolbarRootState.create({
		id: {
			get current() {
				return id;
			},
		},
		orientation: {
			get current() {
				return orientation;
			},
		},
		loop: {
			get current() {
				return loop;
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

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

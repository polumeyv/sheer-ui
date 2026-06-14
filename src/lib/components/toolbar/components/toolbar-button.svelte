<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { ToolbarButtonProps } from '$lib/components/toolbar/index';
	import { ToolbarButtonState } from '$lib/components/toolbar/toolbar.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		child,
		children,
		disabled = false,
		type = 'button',
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: ToolbarButtonProps = $props();

	const buttonState = ToolbarButtonState.create({
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
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, buttonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

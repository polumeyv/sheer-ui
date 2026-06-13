<script lang="ts">
	import { mergeProps } from '$lib/internal/merge-props.js';
	import type { TabsRootProps } from '$lib/components/tabs/primitive/index.js';
	import { TabsRootState } from '$lib/components/tabs/primitive/tabs.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(''),
		onValueChange = (() => {}),
		orientation = 'horizontal',
		loop = true,
		activationMode = 'automatic',
		disabled = false,
		children,
		child,
		class: className,
		...restProps
	}: TabsRootProps = $props();

	const rootState = TabsRootState.create({
		id: {
			get current() {
				return id;
			},
		},
		value: {
			get current() {
				return value;
			},
			set current(v) {
				value = v;
				onValueChange(v);
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
		activationMode: {
			get current() {
				return activationMode;
			},
		},
		disabled: {
			get current() {
				return disabled;
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

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tabs',
				class: cn('flex flex-col gap-2', className),
			},
			restProps,
			rootState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

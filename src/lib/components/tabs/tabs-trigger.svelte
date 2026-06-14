<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { TabsTriggerProps } from '$lib/components/tabs/primitive/index';
	import { TabsTriggerState } from '$lib/components/tabs/primitive/tabs.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		child,
		children,
		disabled = false,
		id = createId(uid),
		type = 'button',
		value,
		ref = $bindable(null),
		class: className,
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

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tabs-trigger',
				class: cn(
					"data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					className,
				),
			},
			restProps,
			triggerState.props,
			{ type },
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

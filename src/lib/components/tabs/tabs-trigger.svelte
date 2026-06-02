<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '../../utils';
	import { mergeProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		child: childProp,
		children,
		...restProps
	}: TabsPrimitive.TriggerProps & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const triggerClass = $derived(
		cn(
			"data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			className,
		),
	);
</script>

{#if childProp}
	<TabsPrimitive.Trigger bind:ref data-slot="tabs-trigger" {...restProps}>
		{#snippet child({ props })}
			{@const mergedProps = mergeProps({ class: triggerClass }, props)}
			{@render childProp({ props: mergedProps })}
		{/snippet}
	</TabsPrimitive.Trigger>
{:else}
	<TabsPrimitive.Trigger bind:ref data-slot="tabs-trigger" class={triggerClass} {...restProps}>
		{@render children?.()}
	</TabsPrimitive.Trigger>
{/if}

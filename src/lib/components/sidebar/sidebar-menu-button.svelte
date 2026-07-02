<script lang="ts" module>
	import { join } from 'overrule';
	import { declareVariants, type VariantProps } from 'overrule';

	export const sidebarMenuButtonVariants = declareVariants({
		base: 'gap-2 rounded-md p-2 text-left ring-sidebar-ring transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
		variants: {
			variant: {
				default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
				outline:
					'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
			},
			size: {
				default: 'h-8 text-sm group-data-[collapsible=icon]:p-2!',
				sm: 'h-7 text-xs group-data-[collapsible=icon]:p-2!',
				lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	});

	export type SidebarMenuButtonVariant = VariantProps<typeof sidebarMenuButtonVariants>['variant'];
	export type SidebarMenuButtonSize = VariantProps<typeof sidebarMenuButtonVariants>['size'];
</script>

<script lang="ts">
	import * as Tooltip from '../tooltip/index';
	import type { WithElementRef, WithoutChildrenOrChild } from '$lib/utils.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { useSidebar } from './context.svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		child,
		variant = 'default',
		size = 'default',
		isActive = false,
		tooltipContent,
		tooltipContentProps,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
		isActive?: boolean;
		variant?: SidebarMenuButtonVariant;
		size?: SidebarMenuButtonSize;
		tooltipContent?: Snippet | string;
		tooltipContentProps?: WithoutChildrenOrChild<ComponentProps<typeof Tooltip.Content>>;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const sidebar = useSidebar();

	const buttonProps = $derived({
		class: join(sidebarMenuButtonVariants({ variant, size }), className),
		'data-slot': 'sidebar-menu-button',
		'data-sidebar': 'menu-button',
		'data-size': size,
		'data-active': isActive,
		...restProps,
	});

	const contentProps = $derived(
		mergeProps({ side: 'right', align: 'center', hidden: sidebar.state !== 'collapsed', class: 'max-md:hidden' }, tooltipContentProps),
	);
</script>

{#snippet Button({ props }: { props?: Record<string, unknown> })}
	{#if child}
		{@render child({ props: mergeProps(buttonProps, props) })}
	{:else}
		<button bind:this={ref} {...mergeProps(buttonProps, props)}>
			{@render children?.()}
		</button>
	{/if}
{/snippet}

{#if !tooltipContent}
	{@render Button({})}
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				{@render Button({ props })}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content {...contentProps}>
			{#if typeof tooltipContent === 'string'}
				{tooltipContent}
			{:else if tooltipContent}
				{@render tooltipContent()}
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
{/if}

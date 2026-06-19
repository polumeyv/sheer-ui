<script lang="ts" module>
	import { declareVariants, type VariantProps } from 'overrule';

	export const badgeVariants = declareVariants({
		base: 'cn-badge focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none',
		variants: {
			variant: {
				default: 'cn-badge-variant-default',
				secondary: 'cn-badge-variant-secondary',
				destructive: 'cn-badge-variant-destructive',
				outline: 'cn-badge-variant-outline',
				ghost: 'cn-badge-variant-ghost',
				link: 'cn-badge-variant-link',
				bronze: 'focus-visible:ring-ring/50 bg-amber-700 text-white [a&]:hover:bg-amber-700/90 border-transparent',
				gold: 'focus-visible:ring-ring/50 bg-amber-500 text-white [a&]:hover:bg-amber-500/90 border-transparent',
				platinum: 'focus-visible:ring-ring/50 bg-slate-400 text-white [a&]:hover:bg-slate-400/90 border-transparent',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}>
	{@render children?.()}
</svelte:element>

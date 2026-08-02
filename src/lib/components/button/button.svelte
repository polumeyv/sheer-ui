<script lang="ts" module>
	import type { WithElementRef } from '../../internal/utils.js';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { buttonVariants, type ButtonVariant, type ButtonSize } from './variants';
	export { buttonVariants, type ButtonVariant, type ButtonSize };
	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
			/** Disables the button and displays a leading spinner. */
			loading?: boolean;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		loading,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={buttonVariants({ variant, size, class: className })}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={buttonVariants({ variant, size, class: className })}
		{type}
		disabled={disabled || loading}
		aria-busy={loading || undefined}
		{...restProps}>
		{#if loading}<Loader2Icon class="animate-spin" />{/if}
		{@render children?.()}
	</button>
{/if}

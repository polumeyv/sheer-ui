<script lang="ts" module>
	import { inputGroupButtonVariants, type InputGroupButtonSize } from './variants';
	export { type InputGroupButtonSize };
</script>

<script lang="ts">
	import { cn } from '../../vendor/utils';
	import type { ComponentProps } from 'svelte';
	import { Button } from '../button/index';

	let {
		ref = $bindable(null),
		class: className,
		children,
		type = 'button',
		variant = 'ghost',
		size = 'xs',
		...restProps
	}: Omit<ComponentProps<typeof Button>, 'href' | 'size'> & {
		size?: InputGroupButtonSize;
	} = $props();
</script>

<Button bind:ref {type} data-size={size} {variant} size={null} class={cn(inputGroupButtonVariants({ size }), className)} {...restProps}>
	{@render children?.()}
</Button>

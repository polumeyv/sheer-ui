<script lang="ts" module>
	import { buttonGroupVariants, type ButtonGroupOrientation } from './variants';
	export { buttonGroupVariants, type ButtonGroupOrientation };
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '../../vendor/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		class: className,
		children,
		orientation = 'horizontal',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: ButtonGroupOrientation;
	} = $props();
</script>

<div bind:this={ref} role="group" data-slot="button-group" data-orientation={orientation} class={cn(buttonGroupVariants({ orientation }), className)} {...restProps}>
	{@render children?.()}
</div>

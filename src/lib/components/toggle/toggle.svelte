<script lang="ts" module>
	import { toggleVariants, type ToggleVariant, type ToggleSize, type ToggleVariants } from './variants';
	export { toggleVariants, type ToggleVariant, type ToggleSize, type ToggleVariants };
</script>

<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui';
	import { cn } from '../../utils.js';

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		class: className,
		size = 'default',
		variant = 'default',
		...restProps
	}: TogglePrimitive.RootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();
</script>

<TogglePrimitive.Root bind:ref bind:pressed data-slot="toggle" class={cn(toggleVariants({ variant, size }), className)} {...restProps} />

<script lang="ts" module>
	import { inputVariants, inputVariantSlots, type InputVariant } from './variants';
	export { inputVariants, type InputVariant };
</script>

<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		variant = 'default',
		class: className,
		...restProps
	}: WithElementRef<Omit<HTMLInputAttributes, 'type'> & { type?: InputType; variant?: InputVariant }> = $props();
</script>

<input
	bind:this={ref}
	data-slot={inputVariantSlots[variant!]}
	class={cn(inputVariants({ variant }), className)}
	{type}
	bind:value
	{...restProps} />

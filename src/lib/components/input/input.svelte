<script lang="ts">
	import { join } from 'overrule';
	import { inputVariants, inputVariantSlots, type InputVariant } from './variants';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils.js';

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
	class={join(inputVariants({ variant }), className)}
	{type}
	bind:value
	{...restProps} />

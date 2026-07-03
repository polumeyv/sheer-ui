<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils.js';
	import { inputVariants, inputVariantSlots, type InputVariant } from './variants';

	let {
		ref = $bindable(null),
		value = $bindable(),
		files = $bindable(),
		variant = 'default',
		class: className,
		...restProps
	}: WithElementRef<Omit<HTMLInputAttributes, 'type'> & { files?: FileList; variant?: InputVariant }> = $props();
</script>

<input
	bind:this={ref}
	data-slot={inputVariantSlots[variant!]}
	class={inputVariants({
		variant,
		class: ['file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground', className],
	})}
	type="file"
	bind:files
	bind:value
	{...restProps} />

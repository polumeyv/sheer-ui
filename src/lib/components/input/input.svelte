<script lang="ts">
	import { inputVariants, inputVariantSlots, type InputVariant } from './variants';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import type { WithElementRef } from '../../internal/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		variant = 'default',
		class: className,
		field,
		defaultValue,
		'aria-invalid': ariaInvalid,
		...restProps
	}: WithElementRef<
		Omit<HTMLInputAttributes, 'type'> & {
			type?: InputType;
			variant?: InputVariant;
			field?: RemoteFormField<any>;
			defaultValue?: string | number;
		}
	> = $props();

	// Keep the remote spread after bind:value/type, matching external .as(...) call sites.
	function fieldProps() {
		if (!field) return { defaultValue };
		return (field.as as (type: InputType, value?: string | number) => HTMLInputAttributes)(type!, defaultValue);
	}
</script>

<input
	bind:this={ref}
	data-slot={inputVariantSlots[variant!]}
	class={inputVariants({ variant, class: className })}
	type={field ? undefined : type}
	bind:value
	{...fieldProps()}
	{...restProps}
	aria-invalid={field ? !!field.issues() : ariaInvalid} />

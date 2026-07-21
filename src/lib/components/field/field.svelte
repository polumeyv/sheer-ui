<script lang="ts" module>
	import { fieldVariants, type FieldOrientation } from './variants';
	export { fieldVariants, type FieldOrientation };
</script>

<script lang="ts">
	import FieldError from './field-error.svelte';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		class: className,
		orientation = 'vertical',
		children,
		field,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: FieldOrientation;
		field?: RemoteFormField<any>;
	} = $props();
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="field"
	data-orientation={orientation}
	class={fieldVariants({ orientation, class: className })}
	data-invalid={field ? !!field.issues() : undefined}
	{...restProps}>
	{@render children?.()}
	{#if field}<FieldError errors={field.issues()} />{/if}
</div>

<script lang="ts" module>
	import { fieldVariants, type FieldOrientation } from './variants';
	export { fieldVariants, type FieldOrientation };

	/** Anything that reports validation issues — deliberately structural so ui never depends on a binding API. */
	export type IssueSource = { issues: () => { message?: string }[] | undefined };
</script>

<script lang="ts">
	import FieldError from './field-error.svelte';
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
		field?: IssueSource;
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

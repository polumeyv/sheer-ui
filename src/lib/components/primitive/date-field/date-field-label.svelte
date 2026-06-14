<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { DateFieldLabelState } from './date-field.svelte.js';
	import type { DateFieldLabelProps } from '$lib/components/primitive/date-field/index';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), children, child, ...restProps }: DateFieldLabelProps = $props();

	const labelState = DateFieldLabelState.create({
		id: {
			get current() {
				return id;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { CheckboxGroupLabelProps } from '../types.js';
	import { CheckboxGroupLabelState } from '../checkbox.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { ref = $bindable(null), id = createId(uid), child, children, ...restProps }: CheckboxGroupLabelProps = $props();

	const labelState = CheckboxGroupLabelState.create({
		get id() {
			return id;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}

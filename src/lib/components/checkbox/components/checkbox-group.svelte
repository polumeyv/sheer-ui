<script lang="ts">
	import { bindableWith, boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { CheckboxGroupProps } from '../types.js';
	import { CheckboxGroupState } from '../checkbox.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		value = $bindable([]),
		onValueChange = () => {},
		required,
		disabled,
		children,
		child,
		readonly,
		...restProps
	}: CheckboxGroupProps = $props();

	const groupState = CheckboxGroupState.create({
		id: boxWith(() => id),
		ref: bindableWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => Boolean(disabled)),
		required: boxWith(() => Boolean(required)),
		readonly: boxWith(() => Boolean(readonly)),
		value: bindableWith(
			() => $state.snapshot(value),
			(v) => (value = $state.snapshot(v)),
			(v) => onValueChange(v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuRadioGroupProps } from '../types.js';
	import { MenuRadioGroupState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable(''),
		onValueChange = () => {},
		...restProps
	}: MenuRadioGroupProps = $props();

	const radioGroupState = MenuRadioGroupState.create({
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			},
		),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		id: boxWith(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, radioGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

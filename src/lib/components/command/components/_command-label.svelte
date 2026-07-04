<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { CommandLabelState } from '../command.svelte.js';

	import type { WithChildren } from '../../../internal/types.js';
	import { createId } from '../../../internal/create-id.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { BitsPrimitiveLabelAttributes, WithElementRef } from '../../../internal/index.js';

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		...restProps
	}: WithChildren<WithElementRef<BitsPrimitiveLabelAttributes>> = $props();

	const labelState = CommandLabelState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

<label {...mergedProps}>
	{@render children?.()}
</label>

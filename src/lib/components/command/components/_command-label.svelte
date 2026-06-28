<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { CommandLabelState } from '../command.svelte.js';

	import type { WithChildren } from '$lib/internal/types.js';
	import { createId } from '$lib/internal/create-id.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { BitsPrimitiveLabelAttributes, WithElementRef } from '$lib/internal/index.js';

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

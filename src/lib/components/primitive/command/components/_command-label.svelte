<script lang="ts">
	import { CommandLabelState } from '$lib/components/primitive/command/command.svelte';

	import type { WithChildren } from '$lib/vendor/types';
	import { createId } from '$lib/vendor/create-id';
	import { mergeProps } from '$lib/merge-props';
	import type { BitsPrimitiveLabelAttributes, WithElementRef } from '$lib/shared/index';

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		...restProps
	}: WithChildren<WithElementRef<BitsPrimitiveLabelAttributes>> = $props();

	const labelState = CommandLabelState.create({
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

</script>

<label {...mergeProps(restProps, labelState.props)}>
	{@render children?.()}
</label>

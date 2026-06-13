<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { ProgressRootProps } from '$lib/components/progress/primitive/types.js';
	import { ProgressRootState } from '$lib/components/progress/primitive/progress.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn, type WithoutChildrenOrChild } from '../../utils';

	const uid = $props.id();

	let {
		value = 0,
		max = 100,
		min = 0,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<ProgressRootProps> = $props();

	const rootState = ProgressRootState.create({
		value: boxWith(() => value),
		max: boxWith(() => max),
		min: boxWith(() => min),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'progress',
				class: cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className),
			},
			restProps,
			rootState.props
		)
	);
</script>

<div {...mergedProps}>
	<div
		data-slot="progress-indicator"
		class="bg-primary h-full w-full flex-1 transition-all"
		style="transform: translateX(-{100 - (100 * (value ?? 0)) / (max ?? 1)}%)"
	></div>
</div>

<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { ProgressRootProps } from '$lib/components/progress/primitive/index';
	import { ProgressRootState } from '$lib/components/progress/primitive/progress.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn, type WithoutChildrenOrChild } from '../../vendor/utils';

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
		value: { get current() { return value; } },
		max: { get current() { return max; } },
		min: { get current() { return min; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
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

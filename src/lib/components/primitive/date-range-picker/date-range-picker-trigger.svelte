<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { DateRangePickerTriggerProps } from '$lib/components/primitive/date-range-picker/index';
	import PopoverTrigger from '$lib/components/primitive/popover/components/popover-trigger.svelte';
	import { dateRangeFieldAttrs } from '$lib/components/primitive/date-range-field/date-range-field.svelte.js';
	import { handleSegmentNavigation, isSegmentNavigationKey } from '$lib/vendor/date-time/field/segments';

	let { ref = $bindable(null), onkeydown, ...restProps }: DateRangePickerTriggerProps = $props();

	function onKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			const currNode = e.currentTarget as HTMLElement;
			const dateFieldInputNode = currNode.closest(dateRangeFieldAttrs.selector('root')) as HTMLElement;
			if (!dateFieldInputNode) return;
			handleSegmentNavigation(e, dateFieldInputNode);
		}
	}

	const mergedProps = $derived(mergeProps({ onkeydown }, { onkeydown: onKeydown }));
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" {...mergedProps} />

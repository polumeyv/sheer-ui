<script lang="ts">
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { DateRangePickerTriggerProps } from "$lib/components/date-range-picker/types.js";
	import PopoverTrigger from "$lib/components/popover/primitive/components/popover-trigger.svelte";
	import { dateRangeFieldAttrs } from "$lib/components/date-range-field/date-range-field.svelte.js";
	import {
		handleSegmentNavigation,
		isSegmentNavigationKey,
	} from "$lib/internal/date-time/field/segments.js";

	let { ref = $bindable(null), onkeydown, ...restProps }: DateRangePickerTriggerProps = $props();

	function onKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			const currNode = e.currentTarget as HTMLElement;
			const dateFieldInputNode = currNode.closest(
				dateRangeFieldAttrs.selector("root")
			) as HTMLElement;
			if (!dateFieldInputNode) return;
			handleSegmentNavigation(e, dateFieldInputNode);
		}
	}

	const mergedProps = $derived(mergeProps({ onkeydown }, { onkeydown: onKeydown }));
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" {...mergedProps} />

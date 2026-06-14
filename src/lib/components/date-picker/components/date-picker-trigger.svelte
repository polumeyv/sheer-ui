<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { DatePickerTriggerProps } from "$lib/components/date-picker/index";
	import PopoverTrigger from "$lib/components/popover/primitive/components/popover-trigger.svelte";
	import { dateFieldAttrs } from "$lib/components/date-field/date-field.svelte";
	import {
		handleSegmentNavigation,
		isSegmentNavigationKey,
	} from "$lib/vendor/date-time/field/segments";

	let { ref = $bindable(null), onkeydown, ...restProps }: DatePickerTriggerProps = $props();

	function onKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			const currNode = e.currentTarget as HTMLElement;
			const dateFieldInputNode = currNode.closest(
				dateFieldAttrs.selector("input")
			) as HTMLElement;
			if (!dateFieldInputNode) return;
			handleSegmentNavigation(e, dateFieldInputNode);
		}
	}

	const mergedProps = $derived(mergeProps({ onkeydown }, { onkeydown: onKeydown }));
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" {...mergedProps} />

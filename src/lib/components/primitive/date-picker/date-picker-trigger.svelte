<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { DatePickerTriggerProps } from "$lib/components/primitive/date-picker/index";
	import PopoverTrigger from "$lib/components/primitive/popover/components/popover-trigger.svelte";
	import { dateFieldAttrs } from "$lib/components/primitive/date-field/date-field.svelte.js";
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

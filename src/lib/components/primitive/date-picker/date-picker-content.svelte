<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { DatePickerContentProps } from "$lib/components/primitive/date-picker/index";
	import PopoverContent from "$lib/components/primitive/popover/components/popover-content.svelte";
	import { pickerOpenFocus } from "$lib/vendor/date-time/calendar-helpers.svelte";

	let { ref = $bindable(null), onOpenAutoFocus, ...restProps }: DatePickerContentProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContent {...mergedProps} bind:ref {...restProps} />

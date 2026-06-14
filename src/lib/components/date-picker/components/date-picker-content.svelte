<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { DatePickerContentProps } from "$lib/components/date-picker/index";
	import PopoverContent from "$lib/components/popover/primitive/components/popover-content.svelte";
	import { pickerOpenFocus } from "$lib/vendor/date-time/calendar-helpers.svelte";

	let { ref = $bindable(null), onOpenAutoFocus, ...restProps }: DatePickerContentProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContent {...mergedProps} bind:ref {...restProps} />

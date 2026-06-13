<script lang="ts">
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { DatePickerContentProps } from "$lib/components/date-picker/index.js";
	import PopoverContent from "$lib/components/popover/primitive/components/popover-content.svelte";
	import { pickerOpenFocus } from "$lib/internal/date-time/calendar-helpers.svelte.js";

	let { ref = $bindable(null), onOpenAutoFocus, ...restProps }: DatePickerContentProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContent {...mergedProps} bind:ref {...restProps} />

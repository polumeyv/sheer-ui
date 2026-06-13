<script lang="ts">
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { DatePickerContentStaticProps } from "$lib/components/date-picker/types.js";
	import PopoverContentStatic from "$lib/components/popover/primitive/components/popover-content-static.svelte";
	import { pickerOpenFocus } from "$lib/internal/date-time/calendar-helpers.svelte.js";

	let {
		ref = $bindable(null),
		onOpenAutoFocus,
		...restProps
	}: DatePickerContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContentStatic {...mergedProps} bind:ref {...restProps} />

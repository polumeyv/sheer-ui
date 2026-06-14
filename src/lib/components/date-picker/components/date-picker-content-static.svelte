<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { DatePickerContentStaticProps } from "$lib/components/date-picker/index";
	import PopoverContentStatic from "$lib/components/popover/primitive/components/popover-content-static.svelte";
	import { pickerOpenFocus } from "$lib/vendor/date-time/calendar-helpers.svelte";

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

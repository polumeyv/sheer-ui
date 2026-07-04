<script lang="ts">
	import { mergeProps } from '../../../merge-props.js';
	import type { DatePickerTriggerProps } from '../types.js';
	import PopoverTrigger from '../../../components/popover/components/popover-trigger.svelte';
	import { dateFieldAttrs } from '../../../components/date-field/date-field.svelte.js';
	import { handleSegmentNavigation, isSegmentNavigationKey } from '../../../internal/date-time/field/segments.js';

	let { ref = $bindable(null), onkeydown, ...restProps }: DatePickerTriggerProps = $props();
	
	const mergedProps = $derived(
		mergeProps(
			{ onkeydown },
			{
				onkeydown: (e: KeyboardEvent) => {
					if (isSegmentNavigationKey(e.key)) {
						const currNode = e.currentTarget as HTMLElement;
						const dateFieldInputNode = currNode.closest(dateFieldAttrs.selector('input')) as HTMLElement;
						if (!dateFieldInputNode) return;
						handleSegmentNavigation(e, dateFieldInputNode);
					}
				},
			},
		),
	);
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" {...mergedProps} />

<script lang="ts">
	// Styled range variant of the time picker block: a popover with paired
	// start/end slot lists and a live duration on the trigger.
	import { TimeRangePicker } from '../blocks/time-picker/index.js';
	import type { SlotRange } from '../blocks/time-picker/time-slots';

	let value = $state<SlotRange>();
</script>

<TimeRangePicker bind:value preset="business" />

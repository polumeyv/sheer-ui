<script lang="ts">
	// `components/time-field` is the headless segmented bits primitive. The styled,
	// ready-to-use version is the time picker block (an outline button that opens a
	// scrollable list of time slots), so this demo uses the block.
	import { TimePicker } from '$lib/blocks/time-picker/index.js';
	import type { TimeString } from '@polumeyv/lib/schemas';

	let value = $state<TimeString>();
</script>

<TimePicker bind:value preset="business" />

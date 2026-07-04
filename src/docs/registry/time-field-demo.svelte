<script lang="ts">
	// `components/time-field` is the headless segmented bits primitive. The styled,
	// ready-to-use version is the time picker block (an outline button that opens a
	// scrollable list of time slots), so this demo uses the block.
	import { TimePicker } from '../../lib/blocks/time-picker/index.js';

	let value = $state<string>();
</script>

<TimePicker bind:value preset="business" />

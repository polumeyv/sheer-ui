<script lang="ts">
	// The styled date picker block: a popover button that opens the styled
	// calendar and renders the chosen date back onto the trigger.
	import { DatePicker } from '../../lib/blocks/date-picker/index.js';
	import type { DateValue } from '@internationalized/date';

	let value = $state<DateValue>();
</script>

<DatePicker bind:value />

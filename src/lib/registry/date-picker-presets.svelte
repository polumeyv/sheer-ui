<script lang="ts" module>
	export const title = 'With presets';
</script>

<script lang="ts">
	// Same picker with a relative-day preset dropdown above the calendar.
	import { DatePickerWithPresets } from '../blocks/date-picker/index.js';
	import type { DateValue } from '@internationalized/date';

	let value = $state<DateValue>();
</script>

<DatePickerWithPresets bind:value />

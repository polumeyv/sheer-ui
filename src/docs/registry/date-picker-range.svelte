<script lang="ts" module>
	export const title = 'Date range';
</script>

<script lang="ts">
	// The range variant opens a styled range calendar and shows the
	// start–end span on the trigger.
	import { RangeDatePicker } from '../../lib/blocks/date-picker/index.js';
	import type { DateRange } from '../../lib/blocks/date-picker/index.js';

	let value = $state<DateRange>();
</script>

<RangeDatePicker bind:value />

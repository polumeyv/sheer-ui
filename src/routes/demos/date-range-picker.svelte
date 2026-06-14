<script lang="ts">
	import * as DatePicker from '$lib/booking/date-picker/index';
	import { DateString } from '@polumeyv/lib/schemas';

	let value = $state<{ start?: DateString; end?: DateString }>({
		start: DateString.make('2026-06-13'),
		end: DateString.make('2026-06-20'),
	});
</script>

<DatePicker.DateRangePicker bind:value placeholder="Pick a date range" triggerClass="w-full max-w-sm" />

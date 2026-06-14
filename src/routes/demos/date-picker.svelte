<script lang="ts">
	import * as DatePicker from '$lib/booking/date-picker/index';
	import { DateString } from '@polumeyv/lib/schemas';

	let value = $state<DateString | undefined>(DateString.make('2026-06-13'));
</script>

<DatePicker.DatePicker bind:value placeholder="Pick a date" captionLayout="dropdown" triggerClass="w-full max-w-sm" />

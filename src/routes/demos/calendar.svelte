<script lang="ts">
	import * as Calendar from '$lib/booking/calendar/index';
	import { DateString } from '@polumeyv/lib/schemas';

	let value = $state<DateString | undefined>(DateString.make('2026-06-13'));
</script>

<Calendar.Calendar type="single" bind:value class="rounded-md border shadow-sm" />

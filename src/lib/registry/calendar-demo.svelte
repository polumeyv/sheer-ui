<script lang="ts">
	// `components/calendar` is the headless bits primitive; `blocks/calendar.svelte`
	// is the styled single-date composition (header + grid + day cells baked in).
	import { Calendar } from '../blocks/index.js';
	import { today, getLocalTimeZone } from '@internationalized/date';

	let value = $state(today(getLocalTimeZone()));
</script>

<Calendar type="single" bind:value class="w-fit" />

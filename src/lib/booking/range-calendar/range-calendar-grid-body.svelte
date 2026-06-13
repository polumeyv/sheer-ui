<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from '$lib/bits-ui.js';

let { ref = $bindable(null), ...restProps }: RangeCalendarPrimitive.GridBodyProps = $props();
</script>

<RangeCalendarPrimitive.GridBody bind:ref {...restProps} />

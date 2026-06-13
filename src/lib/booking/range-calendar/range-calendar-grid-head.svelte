<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from '$lib/bits-ui.js';

let { ref = $bindable(null), ...restProps }: RangeCalendarPrimitive.GridHeadProps = $props();
</script>

<RangeCalendarPrimitive.GridHead bind:ref {...restProps} />

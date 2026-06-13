<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "$lib/components/_shared/primitives.js";

let { ref = $bindable(null), ...restProps }: RangeCalendarPrimitive.GridHeadProps = $props();
</script>

<RangeCalendarPrimitive.GridHead bind:ref {...restProps} />

<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "$lib/components/_shared/primitives.js";

let { ref = $bindable(null), ...restProps }: RangeCalendarPrimitive.GridBodyProps = $props();
</script>

<RangeCalendarPrimitive.GridBody bind:ref {...restProps} />

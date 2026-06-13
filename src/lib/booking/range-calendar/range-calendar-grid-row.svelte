<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from '$lib/bits-ui.js';
import { cn } from '../../utils.js';

let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.GridRowProps = $props();
</script>

<RangeCalendarPrimitive.GridRow bind:ref class={cn("flex", className)} {...restProps} />

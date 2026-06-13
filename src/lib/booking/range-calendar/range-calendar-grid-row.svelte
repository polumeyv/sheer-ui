<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "$lib/components/_shared/primitives.js";
import { cn } from '../../vendor/utils.js';

let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.GridRowProps = $props();
</script>

<RangeCalendarPrimitive.GridRow bind:ref class={cn("flex", className)} {...restProps} />

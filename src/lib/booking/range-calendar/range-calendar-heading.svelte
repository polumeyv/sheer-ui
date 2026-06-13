<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "$lib/components/_shared/primitives.js";
import { cn } from '../../vendor/utils.js';

let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.HeadingProps = $props();
</script>

<RangeCalendarPrimitive.Heading
	bind:ref
	class={cn("px-(--cell-size) text-sm font-medium", className)}
	{...restProps}
/>

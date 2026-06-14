<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "$lib/components/_shared/primitives";
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.GridProps = $props();
</script>

<RangeCalendarPrimitive.Grid
	bind:ref
	class={cn("mt-4 flex w-full border-collapse flex-col gap-1", className)}
	{...restProps}
/>

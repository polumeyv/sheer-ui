<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "$lib/components/_shared/primitives.js";
	import { cn } from '../../vendor/utils.js';

	let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.HeadCellProps = $props();
</script>

<RangeCalendarPrimitive.HeadCell bind:ref class={cn('text-muted-foreground w-(--cell-size) rounded-md text-[0.8rem] font-normal', className)} {...restProps} />

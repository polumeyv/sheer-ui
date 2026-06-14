<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "$lib/components/_shared/primitives";
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.HeaderProps = $props();
</script>

<RangeCalendarPrimitive.Header
	bind:ref
	class={cn(
		"flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
		className
	)}
	{...restProps}
/>

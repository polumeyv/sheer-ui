<script lang="ts">
	import { Calendar as CalendarPrimitive } from "$lib/components/_shared/primitives";
	import { cn } from '../../vendor/utils';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.HeadCellProps = $props();
</script>

<CalendarPrimitive.HeadCell bind:ref class={cn('text-muted-foreground w-(--cell-size) rounded-md text-[0.8rem] font-normal', className)} {...restProps} />

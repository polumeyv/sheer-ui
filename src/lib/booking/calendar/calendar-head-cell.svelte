<script lang="ts">
	import { Calendar as CalendarPrimitive } from '$lib/bits-ui.js';
	import { cn } from '../../utils.js';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.HeadCellProps = $props();
</script>

<CalendarPrimitive.HeadCell bind:ref class={cn('text-muted-foreground w-(--cell-size) rounded-md text-[0.8rem] font-normal', className)} {...restProps} />

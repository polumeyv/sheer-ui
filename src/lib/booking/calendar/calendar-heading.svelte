<script lang="ts">
	import { Calendar as CalendarPrimitive } from '$lib/bits-ui.js';
	import { cn } from '../../utils.js';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.HeadingProps = $props();
</script>

<CalendarPrimitive.Heading bind:ref class={cn('px-(--cell-size) text-sm font-medium', className)} {...restProps} />

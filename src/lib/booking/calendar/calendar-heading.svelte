<script lang="ts">
	import { Calendar as CalendarPrimitive } from "$lib/components/_shared/primitives";
	import { cn } from '../../vendor/utils';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.HeadingProps = $props();
</script>

<CalendarPrimitive.Heading bind:ref class={cn('px-(--cell-size) text-sm font-medium', className)} {...restProps} />

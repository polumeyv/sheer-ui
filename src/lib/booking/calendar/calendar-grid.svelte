<script lang="ts">
	import { Calendar as CalendarPrimitive } from "$lib/components/_shared/primitives";
	import { cn } from '../../vendor/utils';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.GridProps = $props();
</script>

<CalendarPrimitive.Grid bind:ref class={cn('flex w-full border-collapse flex-col', className)} {...restProps} />

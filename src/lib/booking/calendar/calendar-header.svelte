<script lang="ts">
	import { Calendar as CalendarPrimitive } from "$lib/components/_shared/primitives.js";
	import { cn } from '../../vendor/utils.js';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.HeaderProps = $props();
</script>

<CalendarPrimitive.Header
	bind:ref
	class={cn('flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium', className)}
	{...restProps} />

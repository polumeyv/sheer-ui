<script lang="ts">
import { Calendar as CalendarPrimitive } from "$lib/components/_shared/primitives";
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.GridBodyProps = $props();
</script>

<CalendarPrimitive.GridBody bind:ref class={cn(className)} {...restProps} />

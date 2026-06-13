<script lang="ts">
import { Calendar as CalendarPrimitive } from "$lib/components/_shared/primitives.js";
import { cn } from '../../vendor/utils.js';

let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.GridRowProps = $props();
</script>

<CalendarPrimitive.GridRow bind:ref class={cn("flex", className)} {...restProps} />

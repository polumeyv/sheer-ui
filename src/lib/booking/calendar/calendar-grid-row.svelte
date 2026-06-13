<script lang="ts">
import { Calendar as CalendarPrimitive } from '$lib/bits-ui.js';
import { cn } from '../../utils.js';

let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.GridRowProps = $props();
</script>

<CalendarPrimitive.GridRow bind:ref class={cn("flex", className)} {...restProps} />

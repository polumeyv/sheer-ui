<script lang="ts">
import { Calendar as CalendarPrimitive } from '$lib/bits-ui.js';
import { cn } from '../../utils.js';

let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.GridHeadProps = $props();
</script>

<CalendarPrimitive.GridHead bind:ref class={cn(className)} {...restProps} />

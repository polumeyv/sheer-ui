<script lang="ts">
import { Calendar as CalendarPrimitive } from '$lib/bits-ui.js';
import { cn } from '../../utils.js';

let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.GridBodyProps = $props();
</script>

<CalendarPrimitive.GridBody bind:ref class={cn(className)} {...restProps} />

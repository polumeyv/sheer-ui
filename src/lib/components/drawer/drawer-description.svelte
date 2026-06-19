<script lang="ts">
import { Description, type DescriptionProps } from '$lib/components/dialog/index.js';
import { cn } from "$lib/utils.js";

let { ref = $bindable(null), class: className, ...restProps }: DescriptionProps = $props();
</script>

<Description
	bind:ref
	data-slot="drawer-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>

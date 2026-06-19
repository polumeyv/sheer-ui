<script lang="ts">
import { Title, type TitleProps } from '$lib/components/dialog/index.js';
import { cn } from "$lib/utils.js";

let { ref = $bindable(null), class: className, ...restProps }: TitleProps = $props();
</script>

<Title
	bind:ref
	data-slot="drawer-title"
	class={cn("text-foreground font-semibold", className)}
	{...restProps}
/>

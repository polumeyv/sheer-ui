<script lang="ts" module>
import { alertVariants, type AlertVariant } from './variants';
export { alertVariants, type AlertVariant };
</script>

<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "../../vendor/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert"
	class={cn(alertVariants({ variant }), className)}
	{...restProps}
	role="alert"
>
	{@render children?.()}
</div>

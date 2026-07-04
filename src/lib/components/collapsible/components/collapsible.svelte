<script lang="ts">
	import type { CollapsibleRootProps } from '../types.js';

	let {
		open = $bindable(false),
		disabled = false,
		onOpenChange = () => {},
		ref = $bindable(null),
		children,
		...restProps
	}: CollapsibleRootProps = $props();
</script>

<details
	{...restProps}
	data-slot="collapsible"
	{open}
	inert={disabled || undefined}
	ontoggle={(e) => {
		if (e.currentTarget.open === open) return;
		open = e.currentTarget.open;
		onOpenChange(open);
	}}
	bind:this={ref}>
	{@render children?.()}
</details>

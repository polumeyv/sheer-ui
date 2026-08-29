<script lang="ts">
	import { join } from 'overrule';
	import { Label } from '../label';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), class: className, children, ...restProps }: ComponentProps<typeof Label.Root> = $props();
</script>

<Label.Root
	bind:ref
	data-slot="field-label"
	class={join(
		'items-center select-none group-data-disabled/field:pointer-events-none peer-disabled:cursor-not-allowed np-field-label group/field-label peer/field-label flex w-fit leading-snug has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
		className,
	)}
	{...restProps}>
	{@render children?.()}
</Label.Root>

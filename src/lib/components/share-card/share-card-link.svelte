<script lang="ts">
import { cn, type WithElementRef } from '../../utils';
import type { HTMLAttributes } from 'svelte/elements';
import { Input } from '../input';
import { Button } from '../button';
import Copy from '@lucide/svelte/icons/copy';
import Check from '@lucide/svelte/icons/check';

let {
	ref = $bindable(null),
	class: className,
	value,
	label = 'Link',
	buttonText = 'Copy Link',
	onCopy,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	value: string;
	label?: string;
	buttonText?: string;
	onCopy?: (value: string) => void;
} = $props();

let copied = $state(false);

async function handleCopy() {
	await navigator.clipboard.writeText(value);
	copied = true;
	onCopy?.(value);
	setTimeout(() => (copied = false), 2000);
}
</script>

<div
	bind:this={ref}
	data-slot="share-card-link"
	class={cn('flex items-center gap-2', className)}
	{...restProps}
>
	<label for="share-link" class="sr-only">{label}</label>
	<Input id="share-link" {value} readonly class="h-8! flex-1" />
	<Button size="sm" variant="outline" onclick={handleCopy} class="shrink-0 shadow-none">
		{#if copied}
			<Check class="size-4" />
			Copied
		{:else}
			<Copy class="size-4" />
			{buttonText}
		{/if}
	</Button>
</div>

<script lang="ts">
	import { join } from 'overrule';
	import { Button } from '$lib/components/button';
	import * as Tooltip from '$lib/components/tooltip';
	import { UseClipboard } from './copy.svelte';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import CheckIcon from '@lucide/svelte/icons/check';
	import type { ComponentProps } from 'svelte';

	let {
		text,
		variant = 'ghost',
		class: className,
		...restProps
	}: ComponentProps<typeof Button> & {
		text: string;
	} = $props();

	const clipboard = new UseClipboard();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rp = $derived(restProps as any);
</script>

<Tooltip.Root disableCloseOnTriggerClick>
	<Tooltip.Trigger
		{...rp}
		class={join('bg-code absolute inset-e-2 top-3 z-10 size-7! hover:opacity-100 focus-visible:opacity-100', className)}
		onclick={() => clipboard.copy(text)}>
		{#snippet child({ props })}
			<Button {...props} data-slot="copy-button" size="icon" {variant}>
				<span class="sr-only" data-llm-ignore>Copy</span>
				{#if clipboard.copied}
					<CheckIcon />
				{:else}
					<Clipboard />
				{/if}
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>
		{clipboard.copied ? 'Copied' : 'Copy to Clipboard'}
	</Tooltip.Content>
</Tooltip.Root>

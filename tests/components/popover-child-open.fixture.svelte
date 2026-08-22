<script lang="ts">
	import { Popover } from '../../src/lib/components/popover/index.js';

	let open = $state(false);
	export const setOpen = (value: boolean) => (open = value);
</script>

<Popover.Root {open}>
	{#snippet children(popover)}
		<output data-testid="open">{popover.open ? 'open' : 'closed'}</output>
		<Popover.Trigger data-testid="trigger">Trigger</Popover.Trigger>
		<Popover.Content>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} data-testid="content">content</div>
				{/if}
			{/snippet}
		</Popover.Content>
	{/snippet}
</Popover.Root>

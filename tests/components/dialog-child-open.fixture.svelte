<script lang="ts">
	import * as Dialog from '../../src/lib/components/dialog/index.js';

	let open = $state(false);
	export const setOpen = (value: boolean) => (open = value);
</script>

<Dialog.Root {open}>
	{#snippet children(dialog)}
		<output data-testid="open">{dialog.open ? 'open' : 'closed'}</output>
		<Dialog.Content preventScroll={false}>
			{#snippet child({ props, open })}
				{#if open}
					<dialog {...props} data-testid="dialog">content</dialog>
				{/if}
			{/snippet}
		</Dialog.Content>
	{/snippet}
</Dialog.Root>

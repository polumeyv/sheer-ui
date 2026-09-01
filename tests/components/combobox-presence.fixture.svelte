<script lang="ts">
	import * as Combobox from '#lib/components/combobox/index.js';

	let { onOpenChangeComplete = () => {} }: { onOpenChangeComplete?: (open: boolean) => void } = $props();

	let open = $state(false);
	export const setOpen = (value: boolean) => (open = value);
</script>

<Combobox.Root type="single" bind:open {onOpenChangeComplete} items={[{ value: 'a', label: 'A' }]}>
	<Combobox.Input data-testid="input" />
	<Combobox.Content data-testid="content">
		<Combobox.Item value="a" label="A">A</Combobox.Item>
	</Combobox.Content>
</Combobox.Root>

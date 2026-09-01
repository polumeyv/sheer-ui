<script lang="ts">
	import * as Popover from '../../src/lib/components/popover/index.js';

	let open = $state(false);

	export function setOpen(v: boolean) {
		open = v;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>go</Popover.Trigger>
	<Popover.Content>content</Popover.Content>
</Popover.Root>

<script lang="ts">
	import * as Toolbar from '../../lib/components/toolbar/index.js';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import AlignLeftIcon from '@lucide/svelte/icons/align-left';

	let formatting = $state(['bold']);
</script>

<Toolbar.Root class="w-fit rounded-md border p-1">
	<Toolbar.Group type="multiple" bind:value={formatting}>
		<Toolbar.GroupItem value="bold" aria-label="Bold">
			<BoldIcon class="size-4" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem value="italic" aria-label="Italic">
			<ItalicIcon class="size-4" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem value="underline" aria-label="Underline">
			<UnderlineIcon class="size-4" />
		</Toolbar.GroupItem>
	</Toolbar.Group>
	<Toolbar.Button aria-label="Align left">
		<AlignLeftIcon class="size-4" />
	</Toolbar.Button>
</Toolbar.Root>

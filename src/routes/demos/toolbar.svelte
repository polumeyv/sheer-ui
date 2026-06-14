<script lang="ts">
	import * as Toolbar from '$lib/components/toolbar/index';
	import { Separator } from '$lib/components/separator/index';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import AlignStart from '@lucide/svelte/icons/text-align-start';
	import AlignCenter from '@lucide/svelte/icons/text-align-center';
	import AlignEnd from '@lucide/svelte/icons/text-align-end';

	let formatting = $state<string[]>(['bold']);
	let alignment = $state('start');

	const itemClass =
		'inline-flex size-8 items-center justify-center rounded-md text-sm hover:bg-muted data-[state=on]:bg-accent data-[state=on]:text-accent-foreground focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2';
</script>

<Toolbar.Root
	class="flex w-full max-w-md items-center gap-1 rounded-md border bg-background p-1"
>
	<Toolbar.Group bind:value={formatting} type="multiple" class="flex items-center gap-1">
		<Toolbar.GroupItem value="bold" aria-label="Bold" class={itemClass}>
			<Bold class="size-4" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem value="italic" aria-label="Italic" class={itemClass}>
			<Italic class="size-4" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem value="underline" aria-label="Underline" class={itemClass}>
			<Underline class="size-4" />
		</Toolbar.GroupItem>
	</Toolbar.Group>

	<Separator orientation="vertical" class="mx-1 h-6" />

	<Toolbar.Group bind:value={alignment} type="single" class="flex items-center gap-1">
		<Toolbar.GroupItem value="start" aria-label="Align start" class={itemClass}>
			<AlignStart class="size-4" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem value="center" aria-label="Align center" class={itemClass}>
			<AlignCenter class="size-4" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem value="end" aria-label="Align end" class={itemClass}>
			<AlignEnd class="size-4" />
		</Toolbar.GroupItem>
	</Toolbar.Group>

	<Separator orientation="vertical" class="mx-1 h-6" />

	<Toolbar.Button
		class="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-muted focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2"
	>
		Publish
	</Toolbar.Button>
</Toolbar.Root>

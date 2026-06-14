<script lang="ts">
	import * as ContextMenu from '$lib/components/context-menu/index';

	let showBookmarks = $state(true);
	let showFullURLs = $state(false);
	let person = $state('pedro');
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex h-40 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm select-none"
	>
		Right click here
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-52">
		<ContextMenu.Item inset>
			Back
			<ContextMenu.Shortcut>⌘[</ContextMenu.Shortcut>
		</ContextMenu.Item>
		<ContextMenu.Item inset disabled>
			Forward
			<ContextMenu.Shortcut>⌘]</ContextMenu.Shortcut>
		</ContextMenu.Item>
		<ContextMenu.Item inset>
			Reload
			<ContextMenu.Shortcut>⌘R</ContextMenu.Shortcut>
		</ContextMenu.Item>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
			<ContextMenu.SubContent class="w-44">
				<ContextMenu.Item>Save Page As…</ContextMenu.Item>
				<ContextMenu.Item>Create Shortcut…</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Item>Developer Tools</ContextMenu.Item>
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
		<ContextMenu.Separator />
		<ContextMenu.CheckboxItem bind:checked={showBookmarks}>
			Show Bookmarks
		</ContextMenu.CheckboxItem>
		<ContextMenu.CheckboxItem bind:checked={showFullURLs}>
			Show Full URLs
		</ContextMenu.CheckboxItem>
		<ContextMenu.Separator />
		<ContextMenu.RadioGroup bind:value={person}>
			<ContextMenu.GroupHeading inset>People</ContextMenu.GroupHeading>
			<ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
		</ContextMenu.RadioGroup>
	</ContextMenu.Content>
</ContextMenu.Root>

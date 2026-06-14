<script lang="ts">
	import * as Menubar from '$lib/components/menubar/index';

	// 1 — full application menubar (preserved working example)
	let showBookmarks = $state(true);
	let showFullUrls = $state(false);
	let profile = $state('benoit');

	// 3 — checkbox + radio state, surfaced below the menubar
	let panelLeft = $state(true);
	let panelRight = $state(false);
	let statusBar = $state(true);
	let theme = $state('system');

	// 4 — destructive + disabled actions
	let pinned = $state(false);
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — full application menubar -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Application menubar</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Multiple menus with shortcuts, a submenu, checkboxes and a radio group.
			</p>
		</div>
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>File</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						New Tab
						<Menubar.Shortcut>⌘T</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						New Window
						<Menubar.Shortcut>⌘N</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Sub>
						<Menubar.SubTrigger>Share</Menubar.SubTrigger>
						<Menubar.SubContent>
							<Menubar.Item>Email link</Menubar.Item>
							<Menubar.Item>Messages</Menubar.Item>
							<Menubar.Item>Notes</Menubar.Item>
						</Menubar.SubContent>
					</Menubar.Sub>
					<Menubar.Separator />
					<Menubar.Item>
						Print…
						<Menubar.Shortcut>⌘P</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger>Edit</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						Undo
						<Menubar.Shortcut>⌘Z</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						Redo
						<Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item>Cut</Menubar.Item>
					<Menubar.Item>Copy</Menubar.Item>
					<Menubar.Item>Paste</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger>View</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.CheckboxItem bind:checked={showBookmarks}>
						Always Show Bookmarks Bar
					</Menubar.CheckboxItem>
					<Menubar.CheckboxItem bind:checked={showFullUrls}>
						Always Show Full URLs
					</Menubar.CheckboxItem>
					<Menubar.Separator />
					<Menubar.Item inset>
						Reload
						<Menubar.Shortcut>⌘R</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger>Profiles</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.RadioGroup bind:value={profile}>
						<Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
						<Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
						<Menubar.RadioItem value="luis">Luis</Menubar.RadioItem>
					</Menubar.RadioGroup>
					<Menubar.Separator />
					<Menubar.Item inset>Edit…</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	</section>

	<!-- 2 — group heading + label -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Labelled groups</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A single menu using Label, Group and GroupHeading to organise actions.
			</p>
		</div>
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Account</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Label>My Account</Menubar.Label>
					<Menubar.Separator />
					<Menubar.Group>
						<Menubar.GroupHeading inset>Profile</Menubar.GroupHeading>
						<Menubar.Item inset>
							Settings
							<Menubar.Shortcut>⌘,</Menubar.Shortcut>
						</Menubar.Item>
						<Menubar.Item inset>Billing</Menubar.Item>
					</Menubar.Group>
					<Menubar.Separator />
					<Menubar.Group>
						<Menubar.GroupHeading inset>Team</Menubar.GroupHeading>
						<Menubar.Item inset>Invite members</Menubar.Item>
						<Menubar.Item inset>Manage roles</Menubar.Item>
					</Menubar.Group>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	</section>

	<!-- 3 — bound checkbox + radio state -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Toggles &amp; selection</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				CheckboxItem and RadioGroup bound to state shown live below.
			</p>
		</div>
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Layout</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.CheckboxItem bind:checked={panelLeft}>Left panel</Menubar.CheckboxItem>
					<Menubar.CheckboxItem bind:checked={panelRight}>Right panel</Menubar.CheckboxItem>
					<Menubar.CheckboxItem bind:checked={statusBar}>Status bar</Menubar.CheckboxItem>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>Theme</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.RadioGroup bind:value={theme}>
						<Menubar.RadioItem value="light">Light</Menubar.RadioItem>
						<Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
						<Menubar.RadioItem value="system">System</Menubar.RadioItem>
					</Menubar.RadioGroup>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
		<p class="text-muted-foreground text-xs">
			Panels:
			{[panelLeft && 'left', panelRight && 'right'].filter(Boolean).join(', ') || 'none'} ·
			Status bar: {statusBar ? 'on' : 'off'} · Theme: {theme}
		</p>
	</section>

	<!-- 4 — destructive + disabled items -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Destructive &amp; disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				The destructive variant plus a disabled item and a bound checkbox.
			</p>
		</div>
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Document</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						Open
						<Menubar.Shortcut>⌘O</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.CheckboxItem bind:checked={pinned}>Pin to sidebar</Menubar.CheckboxItem>
					<Menubar.Separator />
					<Menubar.Item disabled>Restore version</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item variant="destructive">
						Delete
						<Menubar.Shortcut>⌫</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	</section>
</div>

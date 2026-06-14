<script lang="ts">
	import * as ContextMenu from '$lib/components/context-menu/index';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ScissorsIcon from '@lucide/svelte/icons/scissors';
	import ClipboardIcon from '@lucide/svelte/icons/clipboard';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import UserIcon from '@lucide/svelte/icons/user';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';

	// Shared trigger styling, factored out so each example stays copy-paste sized.
	const TRIGGER =
		'flex h-40 w-full items-center justify-center rounded-md border border-dashed text-sm select-none';

	// 1 — kitchen sink (default browser-style menu)
	let showBookmarks = $state(true);
	let showFullURLs = $state(false);
	let person = $state('pedro');

	// 3 — checkboxes
	let showStatusBar = $state(true);
	let showActivityBar = $state(false);
	let showPanel = $state(false);

	// 4 — radio group
	let panelPosition = $state('bottom');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — kitchen sink -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Kitchen sink</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Submenu, checkboxes, a radio group, shortcuts and inset items.
			</p>
		</div>
		<ContextMenu.Root>
			<ContextMenu.Trigger class={TRIGGER}>Right click here</ContextMenu.Trigger>
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
	</section>

	<!-- 2 — with icons + destructive -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Icons & destructive</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Leading icons per item and a destructive variant.
			</p>
		</div>
		<ContextMenu.Root>
			<ContextMenu.Trigger class={TRIGGER}>Right click here</ContextMenu.Trigger>
			<ContextMenu.Content class="w-52">
				<ContextMenu.Item>
					<CopyIcon />
					Copy
					<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
				</ContextMenu.Item>
				<ContextMenu.Item>
					<ScissorsIcon />
					Cut
					<ContextMenu.Shortcut>⌘X</ContextMenu.Shortcut>
				</ContextMenu.Item>
				<ContextMenu.Item>
					<ClipboardIcon />
					Paste
					<ContextMenu.Shortcut>⌘V</ContextMenu.Shortcut>
				</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Item variant="destructive">
					<Trash2Icon />
					Delete
					<ContextMenu.Shortcut>⌫</ContextMenu.Shortcut>
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	</section>

	<!-- 3 — checkboxes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Checkbox items</h3>
			<p class="text-muted-foreground mt-1 text-xs">Toggle panels with bound checked state.</p>
		</div>
		<ContextMenu.Root>
			<ContextMenu.Trigger class={TRIGGER}>Right click here</ContextMenu.Trigger>
			<ContextMenu.Content class="w-56">
				<ContextMenu.Label inset>Appearance</ContextMenu.Label>
				<ContextMenu.Separator />
				<ContextMenu.CheckboxItem bind:checked={showStatusBar}>
					Status Bar
				</ContextMenu.CheckboxItem>
				<ContextMenu.CheckboxItem bind:checked={showActivityBar} disabled>
					Activity Bar
				</ContextMenu.CheckboxItem>
				<ContextMenu.CheckboxItem bind:checked={showPanel}>Panel</ContextMenu.CheckboxItem>
			</ContextMenu.Content>
		</ContextMenu.Root>
	</section>

	<!-- 4 — radio group -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Radio group</h3>
			<p class="text-muted-foreground mt-1 text-xs">Mutually exclusive choice with a label.</p>
		</div>
		<ContextMenu.Root>
			<ContextMenu.Trigger class={TRIGGER}>Right click here</ContextMenu.Trigger>
			<ContextMenu.Content class="w-56">
				<ContextMenu.Label inset>Panel Position</ContextMenu.Label>
				<ContextMenu.Separator />
				<ContextMenu.RadioGroup bind:value={panelPosition}>
					<ContextMenu.RadioItem value="top">Top</ContextMenu.RadioItem>
					<ContextMenu.RadioItem value="bottom">Bottom</ContextMenu.RadioItem>
					<ContextMenu.RadioItem value="right">Right</ContextMenu.RadioItem>
				</ContextMenu.RadioGroup>
			</ContextMenu.Content>
		</ContextMenu.Root>
	</section>

	<!-- 5 — grouped with labels -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Grouped with labels</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Group, Label, Separator and a nested invite submenu.
			</p>
		</div>
		<ContextMenu.Root>
			<ContextMenu.Trigger class={TRIGGER}>Right click here</ContextMenu.Trigger>
			<ContextMenu.Content class="w-56">
				<ContextMenu.Group>
					<ContextMenu.Label>My Account</ContextMenu.Label>
					<ContextMenu.Separator />
					<ContextMenu.Item>
						<UserIcon />
						Profile
						<ContextMenu.Shortcut>⇧⌘P</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						<MailIcon />
						Messages
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Label>Team</ContextMenu.Label>
					<ContextMenu.Separator />
					<ContextMenu.Sub>
						<ContextMenu.SubTrigger>
							<UserPlusIcon />
							Invite users
						</ContextMenu.SubTrigger>
						<ContextMenu.SubContent class="w-44">
							<ContextMenu.Item>
								<MailIcon />
								Email
							</ContextMenu.Item>
							<ContextMenu.Item>
								<MessageSquareIcon />
								Message
							</ContextMenu.Item>
							<ContextMenu.Separator />
							<ContextMenu.Item>
								<PlusIcon />
								More…
							</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
				</ContextMenu.Group>
			</ContextMenu.Content>
		</ContextMenu.Root>
	</section>
</div>

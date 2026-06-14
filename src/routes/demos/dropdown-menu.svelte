<script lang="ts">
	import * as DropdownMenu from '$lib/components/dropdown-menu/index';
	import { Button } from '$lib/components/button/index';
	import UserIcon from '@lucide/svelte/icons/user';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';
	import GithubIcon from '@lucide/svelte/icons/git-branch';
	import LifeBuoyIcon from '@lucide/svelte/icons/life-buoy';
	import CloudIcon from '@lucide/svelte/icons/cloud';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	// 2 — checkboxes
	let panel = $state(true);
	let toolbar = $state(false);
	let minimap = $state(true);

	// 3 — radio group
	let sort = $state('name');

	// 5 — multiple checkbox group
	let columns = $state<string[]>(['email', 'status']);
	const allColumns = [
		{ value: 'email', label: 'Email' },
		{ value: 'status', label: 'Status' },
		{ value: 'role', label: 'Role' }
	];
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — account menu -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Account menu</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Label, groups, shortcuts and a destructive item.
			</p>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open menu</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="start">
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<UserIcon />
						Profile
						<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						Billing
						<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<SettingsIcon />
						Settings
						<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive">
					<LogOutIcon />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</section>

	<!-- 2 — checkbox items -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Checkbox items</h3>
			<p class="text-muted-foreground mt-1 text-xs">Toggle boolean options independently.</p>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Appearance</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="start">
				<DropdownMenu.Label>Panels</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.CheckboxItem bind:checked={panel}>Panel</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem bind:checked={toolbar}>Toolbar</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem bind:checked={minimap}>Minimap</DropdownMenu.CheckboxItem>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</section>

	<!-- 3 — radio group -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Radio group</h3>
			<p class="text-muted-foreground mt-1 text-xs">Mutually exclusive choices with a heading.</p>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Sort by</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="start">
				<DropdownMenu.RadioGroup bind:value={sort}>
					<DropdownMenu.GroupHeading>Order</DropdownMenu.GroupHeading>
					<DropdownMenu.Separator />
					<DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="date">Date</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="size">Size</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</section>

	<!-- 4 — submenus -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Submenus</h3>
			<p class="text-muted-foreground mt-1 text-xs">Nested items via Sub, SubTrigger, SubContent.</p>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>More</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="start">
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<PlusIcon />
						New Team
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							<UserPlusIcon />
							Invite users
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent class="w-44">
							<DropdownMenu.Item>
								<MailIcon />
								Email
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<MessageSquareIcon />
								Message
							</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<GithubIcon />
					GitHub
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<LifeBuoyIcon />
					Support
				</DropdownMenu.Item>
				<DropdownMenu.Item disabled>
					<CloudIcon />
					API
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</section>

	<!-- 5 — checkbox group + inset -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Column toggles</h3>
			<p class="text-muted-foreground mt-1 text-xs">A CheckboxGroup bound to an array.</p>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Columns</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="start">
				<DropdownMenu.Label inset>Visible columns</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.CheckboxGroup bind:value={columns}>
					{#each allColumns as column (column.value)}
						<DropdownMenu.CheckboxItem value={column.value}>
							{column.label}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.CheckboxGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</section>

	<!-- 6 — destructive -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Destructive</h3>
			<p class="text-muted-foreground mt-1 text-xs">A standalone destructive action.</p>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Manage file</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="start">
				<DropdownMenu.Item>
					<CreditCardIcon />
					Rename
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive">
					<Trash2Icon />
					Delete
					<DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</section>
</div>

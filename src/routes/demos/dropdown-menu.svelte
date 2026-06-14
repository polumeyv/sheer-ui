<script lang="ts">
	import * as DropdownMenu from '$lib/components/dropdown-menu/index';
	import { Button } from '$lib/components/button/index';
	import UserIcon from '@lucide/svelte/icons/user';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import LogOutIcon from '@lucide/svelte/icons/log-out';

	let showStatusBar = $state(true);
	let showActivityBar = $state(false);
	let position = $state('bottom');
</script>

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
		<DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
			Status Bar
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.CheckboxItem bind:checked={showActivityBar}>
			Activity Bar
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup bind:value={position}>
			<DropdownMenu.GroupHeading>Panel Position</DropdownMenu.GroupHeading>
			<DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive">
			<LogOutIcon />
			Log out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

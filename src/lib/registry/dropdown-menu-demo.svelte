<script lang="ts">
	import * as DropdownMenu from '../components/dropdown-menu/index.js';
	import { Button } from '../components/button/index.js';
	import User from '@lucide/svelte/icons/user';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';

	let showStatusBar = $state(true);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant='outline' {...props}>Open menu</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class='w-56'>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<User />
				Profile
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<CreditCard />
				Billing
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Settings />
				Settings
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.CheckboxItem bind:checked={showStatusBar}>Status bar</DropdownMenu.CheckboxItem>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<LogOut />
			Log out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

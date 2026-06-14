<script lang="ts">
	import * as Tabs from '$lib/components/tabs/index';
	import User from '@lucide/svelte/icons/user';
	import Lock from '@lucide/svelte/icons/lock';

	let value = $state('account');
</script>

<Tabs.Root bind:value class="w-full max-w-md">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="account">
			<User />
			Account
		</Tabs.Trigger>
		<Tabs.Trigger value="password">
			<Lock />
			Password
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account" class="rounded-lg border p-4 text-sm">
		<p class="font-medium">Account</p>
		<p class="text-muted-foreground mt-1">
			Make changes to your account here. Click save when you're done.
		</p>
	</Tabs.Content>
	<Tabs.Content value="password" class="rounded-lg border p-4 text-sm">
		<p class="font-medium">Password</p>
		<p class="text-muted-foreground mt-1">
			Change your password here. After saving, you'll be logged out.
		</p>
	</Tabs.Content>
</Tabs.Root>

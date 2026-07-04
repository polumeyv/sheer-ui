<script lang="ts">
	import * as Tabs from "../components/tabs/index.js";
</script>

<Tabs.Root value="account" class="w-96">
	<Tabs.List>
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="password">Password</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account" class="text-muted-foreground text-sm">
		Make changes to your account here. Click save when you're done.
	</Tabs.Content>
	<Tabs.Content value="password" class="text-muted-foreground text-sm">
		Change your password here. After saving, you'll be logged out.
	</Tabs.Content>
</Tabs.Root>

<script lang="ts">
	import * as Command from '$lib/components/command/index';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import CalculatorIcon from '@lucide/svelte/icons/calculator';
	import UserIcon from '@lucide/svelte/icons/user';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import SettingsIcon from '@lucide/svelte/icons/settings';
</script>

<Command.Root class="w-full max-w-md rounded-lg border shadow-md">
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Suggestions">
			<Command.Item>
				<CalendarIcon />
				<span>Calendar</span>
			</Command.Item>
			<Command.Item>
				<SmileIcon />
				<span>Search Emoji</span>
			</Command.Item>
			<Command.Item>
				<CalculatorIcon />
				<span>Calculator</span>
			</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>
				<UserIcon />
				<span>Profile</span>
				<Command.Shortcut>⌘P</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<CreditCardIcon />
				<span>Billing</span>
				<Command.Shortcut>⌘B</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<SettingsIcon />
				<span>Settings</span>
				<Command.Shortcut>⌘S</Command.Shortcut>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Root>

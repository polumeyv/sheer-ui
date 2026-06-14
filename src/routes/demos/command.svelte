<script lang="ts">
	import * as Command from '$lib/components/command/index';
	import { Button } from '$lib/components/button/index';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import CalculatorIcon from '@lucide/svelte/icons/calculator';
	import UserIcon from '@lucide/svelte/icons/user';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import LoaderIcon from '@lucide/svelte/icons/loader-circle';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const ROOT = 'w-full rounded-lg border shadow-md';

	// 2 — command dialog: ⌘/Ctrl-J toggles the palette.
	let dialogOpen = $state(false);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			dialogOpen = !dialogOpen;
		}
	}

	// 3 — selection feedback via onSelect.
	let lastAction = $state('');

	// 4 — loading state toggle.
	let loading = $state(true);
</script>

<svelte:document onkeydown={onKeydown} />

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default command menu -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Command menu</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Input, grouped items, separator and shortcuts.
			</p>
		</div>
		<Command.Root class={ROOT}>
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
	</section>

	<!-- 2 — command dialog -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Command dialog</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A palette in a modal. Press
				<kbd
					class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium"
					>⌘J</kbd
				>
				or use the button.
			</p>
		</div>
		<Button variant="outline" onclick={() => (dialogOpen = true)}>Open command dialog</Button>
		<Command.Dialog bind:open={dialogOpen} title="Command menu" description="Search for a command">
			<Command.Input placeholder="Type a command or search..." />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group heading="Suggestions">
					<Command.Item onSelect={() => (dialogOpen = false)}>
						<CalendarIcon />
						<span>Calendar</span>
					</Command.Item>
					<Command.Item onSelect={() => (dialogOpen = false)}>
						<SmileIcon />
						<span>Search Emoji</span>
					</Command.Item>
				</Command.Group>
				<Command.Separator />
				<Command.Group heading="Settings">
					<Command.Item onSelect={() => (dialogOpen = false)}>
						<UserIcon />
						<span>Profile</span>
						<Command.Shortcut>⌘P</Command.Shortcut>
					</Command.Item>
					<Command.Item onSelect={() => (dialogOpen = false)}>
						<SettingsIcon />
						<span>Settings</span>
						<Command.Shortcut>⌘S</Command.Shortcut>
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Dialog>
	</section>

	<!-- 3 — selection feedback -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With onSelect</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Each item reports its selection via <code>onSelect</code>.
			</p>
		</div>
		<Command.Root class={ROOT}>
			<Command.Input placeholder="Run an action..." />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group heading="Actions">
					<Command.Item onSelect={() => (lastAction = 'Profile')}>
						<UserIcon />
						<span>Profile</span>
					</Command.Item>
					<Command.Item onSelect={() => (lastAction = 'Billing')}>
						<CreditCardIcon />
						<span>Billing</span>
					</Command.Item>
					<Command.Item onSelect={() => (lastAction = 'Settings')}>
						<SettingsIcon />
						<span>Settings</span>
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>
		<p class="text-muted-foreground text-xs">
			Last selected: <span class="text-foreground font-medium">{lastAction || 'none'}</span>
		</p>
	</section>

	<!-- 4 — loading state -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Loading state</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Use <code>Command.Loading</code> while results stream in.
			</p>
		</div>
		<Command.Root class={ROOT} shouldFilter={false}>
			<Command.Input placeholder="Search the docs..." />
			<Command.List>
				{#if loading}
					<Command.Loading>
						<div
							class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm"
						>
							<LoaderIcon class="size-4 animate-spin" />
							Fetching results…
						</div>
					</Command.Loading>
				{:else}
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Results">
						<Command.Item>
							<CalendarIcon />
							<span>Introduction</span>
						</Command.Item>
						<Command.Item>
							<SettingsIcon />
							<span>Configuration</span>
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
		<Button variant="outline" size="sm" onclick={() => (loading = !loading)}>
			{loading ? 'Finish loading' : 'Reset to loading'}
		</Button>
	</section>

	<!-- 5 — disabled items + empty -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled items</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Items can be <code>disabled</code>; search "xyz" to see the empty state.
			</p>
		</div>
		<Command.Root class={ROOT}>
			<Command.Input placeholder="Pick a plan..." />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group heading="Plans">
					<Command.Item>
						<span>Free</span>
					</Command.Item>
					<Command.Item>
						<span>Pro</span>
					</Command.Item>
					<Command.Item disabled>
						<span>Team</span>
						<Command.Shortcut>Soon</Command.Shortcut>
					</Command.Item>
					<Command.Item disabled>
						<span>Enterprise</span>
						<Command.Shortcut>Soon</Command.Shortcut>
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>
	</section>
</div>

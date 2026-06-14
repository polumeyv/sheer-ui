<script lang="ts">
	import * as Sheet from '$lib/components/sheet/index';
	import { Button, buttonVariants } from '$lib/components/button/index';
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
	import type { Side } from '$lib/components/sheet/sheet-content.svelte';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const FIELDS = 'grid flex-1 auto-rows-min gap-4 px-4';
	const FIELD = 'grid gap-2';

	// 2 — sides
	const sides: Side[] = ['top', 'right', 'bottom', 'left'];

	// 4 — controlled
	let controlledOpen = $state(false);

	// 5 — scrollable
	const sections = [
		'Account',
		'Notifications',
		'Privacy',
		'Appearance',
		'Language',
		'Connected apps',
		'Billing',
		'Security',
		'Advanced'
	];
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Trigger, header, form fields and a footer.
			</p>
		</div>
		<Sheet.Root>
			<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>Edit profile</Sheet.Trigger>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Edit profile</Sheet.Title>
					<Sheet.Description>
						Make changes to your profile here. Click save when you're done.
					</Sheet.Description>
				</Sheet.Header>
				<div class={FIELDS}>
					<div class={FIELD}>
						<Label for="sheet-name">Name</Label>
						<Input id="sheet-name" value="Pedro Duarte" />
					</div>
					<div class={FIELD}>
						<Label for="sheet-username">Username</Label>
						<Input id="sheet-username" value="@peduarte" />
					</div>
				</div>
				<Sheet.Footer>
					<Button type="submit">Save changes</Button>
					<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</section>

	<!-- 2 — sides -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sides</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Slide in from top, right, bottom or left.
			</p>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each sides as side (side)}
				<Sheet.Root>
					<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
						{side}
					</Sheet.Trigger>
					<Sheet.Content {side}>
						<Sheet.Header>
							<Sheet.Title class="capitalize">{side} sheet</Sheet.Title>
							<Sheet.Description>
								This panel enters from the {side} edge of the screen.
							</Sheet.Description>
						</Sheet.Header>
						<Sheet.Footer>
							<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Close</Sheet.Close>
						</Sheet.Footer>
					</Sheet.Content>
				</Sheet.Root>
			{/each}
		</div>
	</section>

	<!-- 3 — custom size -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Custom size</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Widen the panel with a <code>class</code> override.
			</p>
		</div>
		<Sheet.Root>
			<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>Open wide</Sheet.Trigger>
			<Sheet.Content class="w-[400px] sm:max-w-[540px]">
				<Sheet.Header>
					<Sheet.Title>Wide panel</Sheet.Title>
					<Sheet.Description>
						The content area is roomier for tables or forms.
					</Sheet.Description>
				</Sheet.Header>
				<div class={FIELDS}>
					<div class={FIELD}>
						<Label for="sheet-bio">Bio</Label>
						<Input id="sheet-bio" value="Building things on the web." />
					</div>
				</div>
				<Sheet.Footer>
					<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Done</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</section>

	<!-- 4 — controlled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Drive open state with <code>bind:open</code>.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" onclick={() => (controlledOpen = true)}>Open</Button>
			<span class="text-muted-foreground text-xs">
				{controlledOpen ? 'open' : 'closed'}
			</span>
		</div>
		<Sheet.Root bind:open={controlledOpen}>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Controlled sheet</Sheet.Title>
					<Sheet.Description>Open state lives in the parent component.</Sheet.Description>
				</Sheet.Header>
				<Sheet.Footer>
					<Button onclick={() => (controlledOpen = false)}>Close from parent</Button>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</section>

	<!-- 5 — scrollable -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Scrollable</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Long body scrolls between a fixed header and footer.
			</p>
		</div>
		<Sheet.Root>
			<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>Settings</Sheet.Trigger>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Settings</Sheet.Title>
					<Sheet.Description>Scroll to reach every section.</Sheet.Description>
				</Sheet.Header>
				<div class="flex-1 overflow-y-auto px-4">
					{#each sections as section (section)}
						<div class="border-b py-4 last:border-b-0">
							<p class="text-sm font-medium">{section}</p>
							<p class="text-muted-foreground text-xs">Manage your {section.toLowerCase()} preferences.</p>
						</div>
					{/each}
				</div>
				<Sheet.Footer>
					<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Close</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</section>
</div>

<script lang="ts">
	import * as Drawer from '$lib/components/drawer/index';
	import { Button, buttonVariants } from '$lib/components/button/index';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const TRIGGER = buttonVariants({ variant: 'outline' });
	const CANCEL = buttonVariants({ variant: 'outline' });
	const INNER = 'mx-auto w-full max-w-sm';
	const LABEL = 'text-sm leading-none font-medium';
	const FIELD =
		'border-input bg-background ring-offset-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

	// 1 — basic goal (preserved working example)
	let goal = $state(350);
	function adjustGoal(delta: number) {
		goal = Math.max(200, Math.min(400, goal + delta));
	}

	// 5 — with form
	const timezones = ['UTC', 'Europe/London', 'America/New_York', 'Asia/Tokyo'];
	let name = $state('');
	let timezone = $state('UTC');

	// 3 — scrollable content
	const cities = [
		'Amsterdam',
		'Berlin',
		'Copenhagen',
		'Dublin',
		'Edinburgh',
		'Florence',
		'Geneva',
		'Helsinki',
		'Istanbul',
		'Lisbon',
		'Madrid',
		'Naples',
		'Oslo',
		'Prague',
		'Rome',
		'Stockholm',
		'Vienna',
		'Warsaw',
		'Zurich'
	];
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — basic goal -->
	<section class="space-y-2">
		<div>
			<h3 class={LABEL}>Basic</h3>
			<p class="text-muted-foreground mt-1 text-xs">Header, footer and interactive content.</p>
		</div>
		<Drawer.Root>
			<Drawer.Trigger class={TRIGGER}>Open drawer</Drawer.Trigger>
			<Drawer.Content>
				<div class={INNER}>
					<Drawer.Header>
						<Drawer.Title>Move goal</Drawer.Title>
						<Drawer.Description>Set your daily activity target.</Drawer.Description>
					</Drawer.Header>
					<div class="flex items-center justify-center gap-6 p-4">
						<Button
							variant="outline"
							size="icon"
							class="size-8 shrink-0 rounded-full"
							aria-label="Decrease goal"
							onclick={() => adjustGoal(-10)}
						>
							<MinusIcon class="size-4" />
						</Button>
						<div class="text-center">
							<span class="text-5xl font-bold tracking-tighter">{goal}</span>
							<span class="text-muted-foreground ml-2 text-sm">cal / day</span>
						</div>
						<Button
							variant="outline"
							size="icon"
							class="size-8 shrink-0 rounded-full"
							aria-label="Increase goal"
							onclick={() => adjustGoal(10)}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<Drawer.Footer>
						<Button>Submit</Button>
						<Drawer.Close class={CANCEL}>Cancel</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</section>

	<!-- 2 — directions -->
	<section class="space-y-2">
		<div>
			<h3 class={LABEL}>Directions</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				The <code>direction</code> prop slides the drawer from any edge.
			</p>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each ['top', 'right', 'bottom', 'left'] as const as direction (direction)}
				<Drawer.Root {direction}>
					<Drawer.Trigger class={TRIGGER}>{direction}</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title>From the {direction}</Drawer.Title>
							<Drawer.Description>This drawer enters from the {direction} edge.</Drawer.Description>
						</Drawer.Header>
						<Drawer.Footer>
							<Drawer.Close class={CANCEL}>Close</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			{/each}
		</div>
	</section>

	<!-- 3 — scrollable content -->
	<section class="space-y-2">
		<div>
			<h3 class={LABEL}>Scrollable content</h3>
			<p class="text-muted-foreground mt-1 text-xs">A long list scrolls inside the panel.</p>
		</div>
		<Drawer.Root>
			<Drawer.Trigger class={TRIGGER}>Pick a city</Drawer.Trigger>
			<Drawer.Content>
				<div class={INNER}>
					<Drawer.Header>
						<Drawer.Title>Cities</Drawer.Title>
						<Drawer.Description>Scroll to browse all destinations.</Drawer.Description>
					</Drawer.Header>
					<div class="max-h-[50vh] overflow-y-auto px-4">
						<ul class="flex flex-col">
							{#each cities as city (city)}
								<li class="border-border/50 border-b py-3 text-sm last:border-b-0">{city}</li>
							{/each}
						</ul>
					</div>
					<Drawer.Footer>
						<Drawer.Close class={CANCEL}>Done</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</section>

	<!-- 4 — non-dismissible -->
	<section class="space-y-2">
		<div>
			<h3 class={LABEL}>Non-dismissible</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				<code>dismissible={false}</code> requires an explicit action to close.
			</p>
		</div>
		<Drawer.Root dismissible={false}>
			<Drawer.Trigger class={TRIGGER}>Confirm action</Drawer.Trigger>
			<Drawer.Content>
				<div class={INNER}>
					<Drawer.Header>
						<Drawer.Title>Are you sure?</Drawer.Title>
						<Drawer.Description>
							The overlay won't dismiss this. Choose an option below.
						</Drawer.Description>
					</Drawer.Header>
					<Drawer.Footer>
						<Drawer.Close class={buttonVariants({ variant: 'destructive' })}>Delete</Drawer.Close>
						<Drawer.Close class={CANCEL}>Cancel</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</section>

	<!-- 5 — with form -->
	<section class="space-y-2">
		<div>
			<h3 class={LABEL}>With a form</h3>
			<p class="text-muted-foreground mt-1 text-xs">Bound inputs inside the drawer body.</p>
		</div>
		<Drawer.Root>
			<Drawer.Trigger class={TRIGGER}>Edit profile</Drawer.Trigger>
			<Drawer.Content>
				<div class={INNER}>
					<Drawer.Header>
						<Drawer.Title>Edit profile</Drawer.Title>
						<Drawer.Description>Update your details, then save.</Drawer.Description>
					</Drawer.Header>
					<div class="flex flex-col gap-4 px-4">
						<div class="flex flex-col gap-2">
							<label class={LABEL} for="drawer-name">Name</label>
							<input
								id="drawer-name"
								bind:value={name}
								placeholder="Ada Lovelace"
								class={FIELD}
							/>
						</div>
						<div class="flex flex-col gap-2">
							<label class={LABEL} for="drawer-tz">Timezone</label>
							<select id="drawer-tz" bind:value={timezone} class={FIELD}>
								{#each timezones as tz (tz)}
									<option value={tz}>{tz}</option>
								{/each}
							</select>
						</div>
					</div>
					<Drawer.Footer>
						<Button disabled={name.trim() === ''}>Save changes</Button>
						<Drawer.Close class={CANCEL}>Cancel</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</section>

	<!-- 6 — nested -->
	<section class="space-y-2">
		<div>
			<h3 class={LABEL}>Nested</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				<code>NestedRoot</code> stacks a drawer inside another.
			</p>
		</div>
		<Drawer.Root>
			<Drawer.Trigger class={TRIGGER}>Open drawer</Drawer.Trigger>
			<Drawer.Content>
				<div class={INNER}>
					<Drawer.Header>
						<Drawer.Title>First level</Drawer.Title>
						<Drawer.Description>Open a second drawer on top of this one.</Drawer.Description>
					</Drawer.Header>
					<Drawer.Footer>
						<Drawer.NestedRoot>
							<Drawer.Trigger class={TRIGGER}>Open nested</Drawer.Trigger>
							<Drawer.Content>
								<div class={INNER}>
									<Drawer.Header>
										<Drawer.Title>Second level</Drawer.Title>
										<Drawer.Description>This drawer is nested inside the first.</Drawer.Description>
									</Drawer.Header>
									<Drawer.Footer>
										<Drawer.Close class={CANCEL}>Close</Drawer.Close>
									</Drawer.Footer>
								</div>
							</Drawer.Content>
						</Drawer.NestedRoot>
						<Drawer.Close class={CANCEL}>Cancel</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</section>
</div>

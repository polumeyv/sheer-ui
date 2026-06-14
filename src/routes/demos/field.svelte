<script lang="ts">
	import * as Field from '$lib/components/field/index';
	import { Input } from '$lib/components/input/index';
	import { Textarea } from '$lib/components/textarea/index';
	import { Switch } from '$lib/components/switch/index';
	import { Checkbox } from '$lib/components/checkbox/index';
	import * as RadioGroup from '$lib/components/radio-group/index';

	// 1 — basic inputs
	// 2 — profile (original demo: validation + horizontal switch)
	let marketing = $state(true);

	// 3 — textarea
	let bio = $state('');

	// 4 — checkbox group
	const addons = [
		{ id: 'newsletter', label: 'Newsletter', description: 'Monthly product news.' },
		{ id: 'updates', label: 'Product updates', description: 'Release notes and changelogs.' },
		{ id: 'offers', label: 'Special offers', description: 'Occasional discounts.' }
	];
	let selectedAddons = $state<string[]>(['newsletter']);

	function toggleAddon(id: string, checked: boolean) {
		selectedAddons = checked
			? [...selectedAddons, id]
			: selectedAddons.filter((a) => a !== id);
	}

	// 5 — radio choice cards
	const plans = [
		{ value: 'starter', title: 'Starter', description: 'For individuals getting started.' },
		{ value: 'pro', title: 'Pro', description: 'For growing teams that need more.' },
		{ value: 'team', title: 'Team', description: 'For organizations at scale.' }
	];
	let plan = $state('pro');
</script>

<div class="flex w-full max-w-md flex-col gap-10">
	<!-- 1 — basic inputs -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Input</h3>
			<p class="text-muted-foreground mt-1 text-xs">Label, control and helper description.</p>
		</div>
		<Field.Group>
			<Field.Field>
				<Field.Label for="field-username">Username</Field.Label>
				<Input id="field-username" placeholder="maxleiter" autocomplete="off" />
				<Field.Description>Choose a unique username for your account.</Field.Description>
			</Field.Field>
			<Field.Field>
				<Field.Label for="field-password">Password</Field.Label>
				<Input id="field-password" type="password" placeholder="••••••••" />
				<Field.Description>Must be at least 8 characters long.</Field.Description>
			</Field.Field>
		</Field.Group>
	</section>

	<!-- 2 — profile (original demo) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Fieldset with validation</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Legend, error state and a horizontal switch field.
			</p>
		</div>
		<Field.Set>
			<Field.Legend>Profile</Field.Legend>
			<Field.Description>Update your account details below.</Field.Description>
			<Field.Group>
				<Field.Field>
					<Field.Label for="demo-name">Name</Field.Label>
					<Input id="demo-name" placeholder="Ada Lovelace" />
				</Field.Field>
				<Field.Field data-invalid={true}>
					<Field.Label for="demo-email">Email</Field.Label>
					<Input id="demo-email" type="email" value="not-an-email" aria-invalid={true} />
					<Field.Error errors={[{ message: 'Enter a valid email address.' }]} />
				</Field.Field>
				<Field.Separator />
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="demo-marketing">Marketing emails</Field.Label>
						<Field.Description>Receive product updates and offers.</Field.Description>
					</Field.Content>
					<Switch id="demo-marketing" bind:checked={marketing} />
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</section>

	<!-- 3 — textarea -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Textarea</h3>
			<p class="text-muted-foreground mt-1 text-xs">A multi-line control with a live counter.</p>
		</div>
		<Field.Field>
			<Field.Label for="field-bio">Bio</Field.Label>
			<Textarea id="field-bio" bind:value={bio} placeholder="Tell us about yourself" rows={3} />
			<Field.Description>{bio.length}/240 characters used.</Field.Description>
		</Field.Field>
	</section>

	<!-- 4 — checkbox group -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Checkbox group</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Horizontal fields inside a labelled fieldset.
			</p>
		</div>
		<Field.Set>
			<Field.Legend variant="label">Email preferences</Field.Legend>
			<Field.Description>Choose what you want to hear about.</Field.Description>
			<Field.Group>
				{#each addons as addon (addon.id)}
					<Field.Field orientation="horizontal">
						<Checkbox
							id={`addon-${addon.id}`}
							checked={selectedAddons.includes(addon.id)}
							onCheckedChange={(checked) => toggleAddon(addon.id, checked === true)}
						/>
						<Field.Content>
							<Field.Label for={`addon-${addon.id}`}>{addon.label}</Field.Label>
							<Field.Description>{addon.description}</Field.Description>
						</Field.Content>
					</Field.Field>
				{/each}
			</Field.Group>
		</Field.Set>
	</section>

	<!-- 5 — radio choice cards -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Choice cards</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Field.Title and Field.Content build selectable cards.
			</p>
		</div>
		<Field.Set>
			<Field.Legend variant="label">Subscription plan</Field.Legend>
			<RadioGroup.Root bind:value={plan} class="gap-3">
				<Field.Group>
					{#each plans as p (p.value)}
						<Field.Label for={`plan-${p.value}`}>
							<Field.Field orientation="horizontal" data-invalid={false}>
								<Field.Content>
									<Field.Title>{p.title}</Field.Title>
									<Field.Description>{p.description}</Field.Description>
								</Field.Content>
								<RadioGroup.Item id={`plan-${p.value}`} value={p.value} />
							</Field.Field>
						</Field.Label>
					{/each}
				</Field.Group>
			</RadioGroup.Root>
		</Field.Set>
	</section>

	<!-- 6 — separator with label -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Separator</h3>
			<p class="text-muted-foreground mt-1 text-xs">A labelled divider between field groups.</p>
		</div>
		<Field.Group>
			<Field.Field>
				<Field.Label for="field-email-2">Email</Field.Label>
				<Input id="field-email-2" type="email" placeholder="you@example.com" />
			</Field.Field>
			<Field.Separator>Or</Field.Separator>
			<Field.Field>
				<Field.Label for="field-phone">Phone</Field.Label>
				<Input id="field-phone" type="tel" placeholder="+1 (555) 000-0000" />
			</Field.Field>
		</Field.Group>
	</section>
</div>

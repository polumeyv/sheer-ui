<script lang="ts">
	import * as RadioGroup from '$lib/components/radio-group/index';
	import { Label } from '$lib/components/label/index';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const ROW = 'flex items-center gap-3';
	const CARD =
		'has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent flex items-start gap-3 rounded-lg border p-3 transition-colors';

	// 1 — default (preserved from the original demo)
	let density = $state('comfortable');

	// 2 — horizontal orientation
	let pay = $state('card');

	// 3 — with descriptions
	type Plan = { value: string; label: string; description: string };
	const plans: Plan[] = [
		{ value: 'starter', label: 'Starter', description: 'For hobby projects and side gigs.' },
		{ value: 'pro', label: 'Pro', description: 'For growing teams that ship often.' },
		{ value: 'scale', label: 'Scale', description: 'For high-traffic production workloads.' }
	];
	let plan = $state('pro');

	// 4 — disabled items + whole-group disabled
	const shipping: { value: string; label: string; disabled?: boolean }[] = [
		{ value: 'standard', label: 'Standard (3–5 days)' },
		{ value: 'express', label: 'Express (1–2 days)' },
		{ value: 'overnight', label: 'Overnight', disabled: true }
	];
	let ship = $state('standard');
	let frozen = $state('default');

	// 5 — card-style with form submission
	const tiers: { value: string; label: string; price: string }[] = [
		{ value: 'monthly', label: 'Monthly', price: '$12 / mo' },
		{ value: 'yearly', label: 'Yearly', price: '$120 / yr' }
	];
	let tier = $state('yearly');
	let submitted = $state('');

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const data = new FormData(e.currentTarget as HTMLFormElement);
		submitted = String(data.get('billing') ?? '');
	}
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">A basic vertical radio group with labels.</p>
		</div>
		<RadioGroup.Root bind:value={density} class="gap-3">
			<div class={ROW}>
				<RadioGroup.Item value="default" id="r-default" />
				<Label for="r-default">Default</Label>
			</div>
			<div class={ROW}>
				<RadioGroup.Item value="comfortable" id="r-comfortable" />
				<Label for="r-comfortable">Comfortable</Label>
			</div>
			<div class={ROW}>
				<RadioGroup.Item value="compact" id="r-compact" />
				<Label for="r-compact">Compact</Label>
			</div>
		</RadioGroup.Root>
	</section>

	<!-- 2 — horizontal -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Horizontal</h3>
			<p class="text-muted-foreground mt-1 text-xs">Lay items out in a row with orientation.</p>
		</div>
		<RadioGroup.Root bind:value={pay} orientation="horizontal" class="flex flex-row gap-6">
			<div class={ROW}>
				<RadioGroup.Item value="card" id="pay-card" />
				<Label for="pay-card">Card</Label>
			</div>
			<div class={ROW}>
				<RadioGroup.Item value="paypal" id="pay-paypal" />
				<Label for="pay-paypal">PayPal</Label>
			</div>
			<div class={ROW}>
				<RadioGroup.Item value="bank" id="pay-bank" />
				<Label for="pay-bank">Bank</Label>
			</div>
		</RadioGroup.Root>
	</section>

	<!-- 3 — with descriptions -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With descriptions</h3>
			<p class="text-muted-foreground mt-1 text-xs">Pair each option with secondary text.</p>
		</div>
		<RadioGroup.Root bind:value={plan} class="gap-4">
			{#each plans as p (p.value)}
				<div class="flex items-start gap-3">
					<RadioGroup.Item value={p.value} id={`plan-${p.value}`} class="mt-0.5" />
					<div class="grid gap-1">
						<Label for={`plan-${p.value}`}>{p.label}</Label>
						<p class="text-muted-foreground text-xs">{p.description}</p>
					</div>
				</div>
			{/each}
		</RadioGroup.Root>
	</section>

	<!-- 4 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">A disabled item, plus a fully disabled group.</p>
		</div>
		<RadioGroup.Root bind:value={ship} class="gap-3">
			{#each shipping as s (s.value)}
				<div class={ROW}>
					<RadioGroup.Item value={s.value} id={`ship-${s.value}`} disabled={s.disabled} />
					<Label for={`ship-${s.value}`} class="data-disabled:opacity-50">{s.label}</Label>
				</div>
			{/each}
		</RadioGroup.Root>
		<RadioGroup.Root bind:value={frozen} disabled class="mt-2 gap-3 opacity-60">
			<div class={ROW}>
				<RadioGroup.Item value="default" id="frozen-default" />
				<Label for="frozen-default">Locked selection</Label>
			</div>
		</RadioGroup.Root>
	</section>

	<!-- 5 — card style + form -->
	<section class="space-y-2 sm:col-span-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Cards with form</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Clickable cards using <code>name</code> for native form submission.
			</p>
		</div>
		<form onsubmit={onSubmit} class="space-y-3">
			<RadioGroup.Root bind:value={tier} name="billing" required class="grid gap-3 sm:grid-cols-2">
				{#each tiers as t (t.value)}
					<Label for={`tier-${t.value}`} class={CARD}>
						<RadioGroup.Item value={t.value} id={`tier-${t.value}`} class="mt-0.5" />
						<div class="grid gap-1">
							<span class="text-sm font-medium">{t.label}</span>
							<span class="text-muted-foreground text-xs">{t.price}</span>
						</div>
					</Label>
				{/each}
			</RadioGroup.Root>
			<div class="flex items-center gap-3">
				<button
					type="submit"
					class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
				>
					Subscribe
				</button>
				{#if submitted}
					<span class="text-muted-foreground text-xs">Submitted: {submitted}</span>
				{/if}
			</div>
		</form>
	</section>
</div>

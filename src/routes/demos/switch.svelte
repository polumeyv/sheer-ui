<script lang="ts">
	import { Switch } from '$lib/components/switch/index';
	import { Label } from '$lib/components/label/index';

	// Shared class strings, factored out so each example stays copy-paste sized.
	const ROW = 'flex items-center gap-2';
	const SETTING = 'flex items-center justify-between gap-4 rounded-lg border p-4';
	const CARD =
		'flex items-start gap-3 rounded-lg border p-4 has-[[data-state=checked]]:border-primary';

	// 3 — controlled / bound
	let wifi = $state(true);

	// 4 — settings list
	let settings = $state({
		marketing: true,
		security: false,
		social: false
	});

	// 6 — billing card
	let annual = $state(false);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — with label (default) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With label</h3>
			<p class="text-muted-foreground mt-1 text-xs">The default pattern: a switch tied to a label.</p>
		</div>
		<div class={ROW}>
			<Switch id="airplane-mode" />
			<Label for="airplane-mode">Airplane Mode</Label>
		</div>
	</section>

	<!-- 2 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Non-interactive, in both off and on states.</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class={ROW}>
				<Switch id="disabled-off" disabled />
				<Label for="disabled-off" class="opacity-50">Off &amp; disabled</Label>
			</div>
			<div class={ROW}>
				<Switch id="disabled-on" disabled checked />
				<Label for="disabled-on" class="opacity-50">On &amp; disabled</Label>
			</div>
		</div>
	</section>

	<!-- 3 — controlled / bound -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Two-way bound state you can read elsewhere.</p>
		</div>
		<div class={ROW}>
			<Switch id="wifi" bind:checked={wifi} />
			<Label for="wifi">Wi-Fi is {wifi ? 'on' : 'off'}</Label>
		</div>
	</section>

	<!-- 4 — settings list -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Settings list</h3>
			<p class="text-muted-foreground mt-1 text-xs">Switches inside rows with helper text.</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class={SETTING}>
				<div class="space-y-0.5">
					<Label for="set-marketing">Marketing emails</Label>
					<p class="text-muted-foreground text-xs">Receive product news and offers.</p>
				</div>
				<Switch id="set-marketing" bind:checked={settings.marketing} />
			</div>
			<div class={SETTING}>
				<div class="space-y-0.5">
					<Label for="set-security">Security alerts</Label>
					<p class="text-muted-foreground text-xs">Get notified about new sign-ins.</p>
				</div>
				<Switch id="set-security" bind:checked={settings.security} />
			</div>
			<div class={SETTING}>
				<div class="space-y-0.5">
					<Label for="set-social">Social activity</Label>
					<p class="text-muted-foreground text-xs">Mentions, follows and reactions.</p>
				</div>
				<Switch id="set-social" bind:checked={settings.social} />
			</div>
		</div>
	</section>

	<!-- 5 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Tune scale through the class prop.</p>
		</div>
		<div class="flex items-center gap-4">
			<Switch id="size-sm" checked class="h-4 w-7 [&_[data-slot=switch-thumb]]:size-3" />
			<Switch id="size-md" checked />
			<Switch id="size-lg" checked class="h-6 w-11 [&_[data-slot=switch-thumb]]:size-5" />
		</div>
	</section>

	<!-- 6 — billing card -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">In a card</h3>
			<p class="text-muted-foreground mt-1 text-xs">Highlights its container when checked.</p>
		</div>
		<label class={CARD} for="billing-annual">
			<Switch id="billing-annual" bind:checked={annual} class="mt-0.5" />
			<div class="space-y-0.5">
				<span class="text-sm leading-none font-medium">Annual billing</span>
				<p class="text-muted-foreground text-xs">
					{annual ? 'Save 20% with yearly payments.' : 'Switch on to save 20%.'}
				</p>
			</div>
		</label>
	</section>
</div>

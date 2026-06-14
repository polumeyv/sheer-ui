<script lang="ts">
	import { Checkbox } from '$lib/components/checkbox/index';
	import { Label } from '$lib/components/label/index';

	// Shared class strings, factored out so each example stays copy-paste sized.
	const FIELD = 'flex items-start gap-3';
	const STACK = 'grid gap-1.5 leading-none';
	const TITLE = 'text-sm leading-tight font-medium';
	const HINT = 'text-muted-foreground text-sm';

	// 1 — default (the original demo, preserved)
	let terms = $state(true);

	// 2 — disabled
	let notifications = $state(false);

	// 3 — card style with rich description
	let marketing = $state(true);

	// 4 — invalid / destructive
	let agree = $state(false);
	const invalid = $derived(!agree);

	// 5 — group with indeterminate "select all"
	type Item = { id: string; label: string };
	const sidebarItems: Item[] = [
		{ id: 'recents', label: 'Recents' },
		{ id: 'home', label: 'Home' },
		{ id: 'apps', label: 'Applications' },
		{ id: 'desktop', label: 'Desktop' }
	];
	let selected = $state<string[]>(['recents', 'home']);
	const allChecked = $derived(selected.length === sidebarItems.length);
	const someChecked = $derived(selected.length > 0 && !allChecked);

	function toggle(id: string, checked: boolean) {
		selected = checked ? [...selected, id] : selected.filter((x) => x !== id);
	}

	function toggleAll(checked: boolean) {
		selected = checked ? sidebarItems.map((i) => i.id) : [];
	}
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">A checkbox bound to a label.</p>
		</div>
		<div class={FIELD}>
			<Checkbox id="terms" bind:checked={terms} class="mt-0.5" />
			<Label for="terms" class="text-sm leading-tight">
				I agree to the Terms of Service and Privacy Policy
			</Label>
		</div>
	</section>

	<!-- 2 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Not interactive; dimmed.</p>
		</div>
		<div class={FIELD}>
			<Checkbox id="notifications" bind:checked={notifications} disabled class="mt-0.5" />
			<Label for="notifications" class="text-sm leading-tight opacity-70">
				Enable notifications
			</Label>
		</div>
	</section>

	<!-- 3 — with description -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With description</h3>
			<p class="text-muted-foreground mt-1 text-xs">A title plus a secondary hint line.</p>
		</div>
		<div class={FIELD}>
			<Checkbox id="marketing" bind:checked={marketing} class="mt-0.5" />
			<div class={STACK}>
				<Label for="marketing" class={TITLE}>Send me product updates</Label>
				<p class={HINT}>Occasional emails about new features. No spam, unsubscribe anytime.</p>
			</div>
		</div>
	</section>

	<!-- 4 — invalid / destructive -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Invalid</h3>
			<p class="text-muted-foreground mt-1 text-xs">Required field shown in an error state.</p>
		</div>
		<div class={FIELD}>
			<Checkbox id="agree" bind:checked={agree} required aria-invalid={invalid} class="mt-0.5" />
			<div class={STACK}>
				<Label for="agree" class={TITLE}>Accept the conditions</Label>
				{#if invalid}
					<p class="text-destructive text-sm">You must accept before continuing.</p>
				{/if}
			</div>
		</div>
	</section>

	<!-- 5 — group with indeterminate select-all -->
	<section class="space-y-2 sm:col-span-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Select all (indeterminate)</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Parent reflects a mixed selection via <code>indeterminate</code>.
			</p>
		</div>
		<div class="space-y-3">
			<div class={FIELD}>
				<Checkbox
					id="select-all"
					checked={allChecked}
					indeterminate={someChecked}
					onCheckedChange={(v) => toggleAll(v)}
					class="mt-0.5"
				/>
				<Label for="select-all" class={TITLE}>Select all</Label>
			</div>
			<div class="ms-7 grid gap-3">
				{#each sidebarItems as item (item.id)}
					<div class={FIELD}>
						<Checkbox
							id={`item-${item.id}`}
							checked={selected.includes(item.id)}
							onCheckedChange={(v) => toggle(item.id, v)}
							class="mt-0.5"
						/>
						<Label for={`item-${item.id}`} class="text-sm leading-tight">{item.label}</Label>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>

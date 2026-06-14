<script lang="ts">
	import { Progress } from '$lib/components/progress/index';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const FIELD = 'flex w-full flex-col gap-2';
	const ROW = 'flex items-center justify-between text-sm';
	const LABEL = 'text-muted-foreground';
	const VALUE = 'font-medium';

	// 1 — animated default: toggle the value to watch the fill transition (shadcn's example).
	let animated = $state(13);
	const toggle = () => (animated = animated === 13 ? 66 : 13);

	// 2 — labelled upload (preserved from the original demo).
	const upload = 60;

	// 3 — interactive stepper.
	let stepped = $state(40);
	const dec = () => (stepped = Math.max(0, stepped - 10));
	const inc = () => (stepped = Math.min(100, stepped + 10));

	// 4 — indeterminate: value is null, so the bar shows an unknown-progress state.
	const indeterminate = null;

	// 5 — sizes via the track height override.
	const sizes = [
		{ label: 'Small', value: 45, class: 'h-1' },
		{ label: 'Default', value: 65, class: 'h-2' },
		{ label: 'Large', value: 80, class: 'h-3' }
	];

	// 6 — colour variants: override the track tint and the indicator fill via class.
	const variants = [
		{ label: 'Success', value: 100, class: 'bg-emerald-500/20 [&>[data-slot=progress-indicator]]:bg-emerald-500' },
		{ label: 'Warning', value: 70, class: 'bg-amber-500/20 [&>[data-slot=progress-indicator]]:bg-amber-500' },
		{ label: 'Destructive', value: 35, class: 'bg-destructive/20 [&>[data-slot=progress-indicator]]:bg-destructive' }
	];
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — animated default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Animated</h3>
			<p class="text-muted-foreground mt-1 text-xs">The fill transitions when the value changes.</p>
		</div>
		<div class={FIELD}>
			<Progress value={animated} max={100} />
			<button
				type="button"
				class="border-input hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-fit items-center justify-center rounded-md border px-3 text-sm"
				onclick={toggle}
			>
				Toggle
			</button>
		</div>
	</section>

	<!-- 2 — labelled upload -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With label</h3>
			<p class="text-muted-foreground mt-1 text-xs">Pair the bar with a heading and percentage.</p>
		</div>
		<div class={FIELD}>
			<div class={ROW}>
				<span class={LABEL}>Uploading</span>
				<span class={VALUE}>{upload}%</span>
			</div>
			<Progress value={upload} max={100} />
		</div>
	</section>

	<!-- 3 — interactive stepper -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Interactive</h3>
			<p class="text-muted-foreground mt-1 text-xs">Bind the value and drive it from controls.</p>
		</div>
		<div class={FIELD}>
			<div class={ROW}>
				<span class={LABEL}>Progress</span>
				<span class={VALUE}>{stepped}%</span>
			</div>
			<Progress value={stepped} max={100} />
			<div class="flex gap-2">
				<button
					type="button"
					class="border-input hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md border disabled:opacity-50"
					aria-label="Decrease"
					disabled={stepped === 0}
					onclick={dec}
				>
					<MinusIcon class="size-4" />
				</button>
				<button
					type="button"
					class="border-input hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md border disabled:opacity-50"
					aria-label="Increase"
					disabled={stepped === 100}
					onclick={inc}
				>
					<PlusIcon class="size-4" />
				</button>
			</div>
		</div>
	</section>

	<!-- 4 — indeterminate -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Indeterminate</h3>
			<p class="text-muted-foreground mt-1 text-xs">A null value renders an unknown-progress state.</p>
		</div>
		<Progress value={indeterminate} max={100} />
	</section>

	<!-- 5 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Override the track height with a class.</p>
		</div>
		<div class="flex flex-col gap-3">
			{#each sizes as s (s.label)}
				<div class={FIELD}>
					<div class={ROW}>
						<span class={LABEL}>{s.label}</span>
						<span class={VALUE}>{s.value}%</span>
					</div>
					<Progress value={s.value} max={100} class={s.class} />
				</div>
			{/each}
		</div>
	</section>

	<!-- 6 — colour variants -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Variants</h3>
			<p class="text-muted-foreground mt-1 text-xs">Recolour the track and fill with a class.</p>
		</div>
		<div class="flex flex-col gap-3">
			{#each variants as v (v.label)}
				<div class={FIELD}>
					<div class={ROW}>
						<span class={LABEL}>{v.label}</span>
						<span class={VALUE}>{v.value}%</span>
					</div>
					<Progress value={v.value} max={100} class={v.class} />
				</div>
			{/each}
		</div>
	</section>
</div>

<script lang="ts">
	import { AspectRatio } from '$lib/components/aspect-ratio/index';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const FRAME = 'overflow-hidden rounded-md bg-muted';
	const IMG = 'h-full w-full object-cover';

	// A single Unsplash photo reused across the ratio examples.
	const PHOTO = 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80';

	// Interactive ratio picker.
	const ratios = [
		{ value: 16 / 9, label: '16:9' },
		{ value: 4 / 3, label: '4:3' },
		{ value: 1, label: '1:1' },
		{ value: 3 / 4, label: '3:4' }
	];
	let ratio = $state(16 / 9);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — widescreen 16:9 (the canonical example) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Widescreen</h3>
			<p class="text-muted-foreground mt-1 text-xs">A 16:9 image, the default photo ratio.</p>
		</div>
		<AspectRatio ratio={16 / 9} class={FRAME}>
			<img src={PHOTO} alt="A scenic landscape" class={IMG} />
		</AspectRatio>
	</section>

	<!-- 2 — square 1:1 -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Square</h3>
			<p class="text-muted-foreground mt-1 text-xs">A 1:1 ratio, handy for avatars and tiles.</p>
		</div>
		<AspectRatio ratio={1} class={FRAME}>
			<img src={PHOTO} alt="A scenic landscape" class={IMG} />
		</AspectRatio>
	</section>

	<!-- 3 — standard 4:3 -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Standard</h3>
			<p class="text-muted-foreground mt-1 text-xs">A 4:3 ratio, classic photo framing.</p>
		</div>
		<AspectRatio ratio={4 / 3} class={FRAME}>
			<img src={PHOTO} alt="A scenic landscape" class={IMG} />
		</AspectRatio>
	</section>

	<!-- 4 — portrait 3:4 -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Portrait</h3>
			<p class="text-muted-foreground mt-1 text-xs">A 3:4 ratio, taller than it is wide.</p>
		</div>
		<AspectRatio ratio={3 / 4} class={FRAME}>
			<img src={PHOTO} alt="A scenic landscape" class={IMG} />
		</AspectRatio>
	</section>

	<!-- 5 — placeholder content (not just images) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Placeholder</h3>
			<p class="text-muted-foreground mt-1 text-xs">Any content fills the reserved box.</p>
		</div>
		<AspectRatio ratio={16 / 9} class="rounded-md border border-dashed">
			<div class="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
				16 / 9
			</div>
		</AspectRatio>
	</section>

	<!-- 6 — interactive ratio picker -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Interactive</h3>
			<p class="text-muted-foreground mt-1 text-xs">Pick a ratio and watch the box reflow.</p>
		</div>
		<div class="flex gap-1">
			{#each ratios as r (r.label)}
				<button
					type="button"
					onclick={() => (ratio = r.value)}
					aria-pressed={ratio === r.value}
					class="aria-pressed:bg-primary aria-pressed:text-primary-foreground border-input rounded-md border px-2 py-1 text-xs"
				>
					{r.label}
				</button>
			{/each}
		</div>
		<AspectRatio {ratio} class={FRAME}>
			<img src={PHOTO} alt="A scenic landscape" class={IMG} />
		</AspectRatio>
	</section>
</div>

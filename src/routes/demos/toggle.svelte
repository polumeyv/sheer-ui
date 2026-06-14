<script lang="ts">
	import * as Toggle from '$lib/components/toggle/index';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import Star from '@lucide/svelte/icons/star';

	// Shared label styling, factored out so each example stays copy-paste sized.
	const VALUE = 'text-muted-foreground text-xs';

	// 1 — default (text formatting bar)
	let bold = $state(true);
	let italic = $state(false);

	// 2 — outline variant
	let outline = $state(false);

	// 3 — with text + icon
	let withText = $state(false);

	// 4 — controlled (onPressedChange)
	let favorite = $state(false);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Icon-only toggles with bindable pressed state.</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Toggle.Root bind:pressed={bold} aria-label="Toggle bold">
				<Bold class="size-4" />
			</Toggle.Root>
			<Toggle.Root bind:pressed={italic} aria-label="Toggle italic">
				<Italic class="size-4" />
			</Toggle.Root>
		</div>
		<p class={VALUE}>bold: {bold} · italic: {italic}</p>
	</section>

	<!-- 2 — outline -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Outline</h3>
			<p class="text-muted-foreground mt-1 text-xs">The bordered variant for standalone toggles.</p>
		</div>
		<Toggle.Root variant="outline" bind:pressed={outline} aria-label="Toggle italic">
			<Italic class="size-4" />
		</Toggle.Root>
	</section>

	<!-- 3 — with text -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With text</h3>
			<p class="text-muted-foreground mt-1 text-xs">An icon paired with a visible label.</p>
		</div>
		<Toggle.Root variant="outline" bind:pressed={withText} aria-label="Toggle italic">
			<Italic class="size-4" />
			Italic
		</Toggle.Root>
	</section>

	<!-- 4 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Small, default and large via the size prop.</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Toggle.Root size="sm" aria-label="Small toggle">
				<Underline class="size-4" />
			</Toggle.Root>
			<Toggle.Root size="default" aria-label="Default toggle">
				<Underline class="size-4" />
			</Toggle.Root>
			<Toggle.Root size="lg" aria-label="Large toggle">
				<Underline class="size-4" />
			</Toggle.Root>
		</div>
	</section>

	<!-- 5 — controlled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">React to changes with onPressedChange.</p>
		</div>
		<Toggle.Root
			variant="outline"
			pressed={favorite}
			onPressedChange={(v) => (favorite = v)}
			aria-label="Toggle favorite"
		>
			<Star class="size-4" />
			{favorite ? 'Favorited' : 'Favorite'}
		</Toggle.Root>
	</section>

	<!-- 6 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">A non-interactive toggle, on and off.</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Toggle.Root disabled aria-label="Disabled toggle">
				<Underline class="size-4" />
			</Toggle.Root>
			<Toggle.Root disabled pressed aria-label="Disabled pressed toggle">
				<Underline class="size-4" />
			</Toggle.Root>
		</div>
	</section>
</div>

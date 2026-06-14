<script lang="ts">
	import * as Avatar from '$lib/components/avatar/index';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const RING = 'ring-background ring-2';
	const FALLBACK = 'text-xs font-medium';

	// People used by the stacked / grouped example.
	const team = [
		{ src: 'https://github.com/sveltejs.png', alt: 'Svelte', initials: 'SV' },
		{ src: 'https://github.com/torvalds.png', alt: 'Linus', initials: 'LT' },
		{ src: 'https://github.com/Rich-Harris.png', alt: 'Rich Harris', initials: 'RH' }
	];
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Image with a text fallback while loading.</p>
		</div>
		<div class="flex items-center gap-4">
			<Avatar.Root>
				<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
				<Avatar.Fallback>SV</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback>NP</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</section>

	<!-- 2 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Resize with a single utility on Root.</p>
		</div>
		<div class="flex items-center gap-4">
			<Avatar.Root class="size-6">
				<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
				<Avatar.Fallback class={FALLBACK}>SV</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root class="size-8">
				<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
				<Avatar.Fallback class={FALLBACK}>SV</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root class="size-12">
				<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
				<Avatar.Fallback>SV</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root class="size-16">
				<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
				<Avatar.Fallback>SV</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</section>

	<!-- 3 — rounded -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Rounded</h3>
			<p class="text-muted-foreground mt-1 text-xs">Square it off with a rounded-lg corner.</p>
		</div>
		<div class="flex items-center gap-4">
			<Avatar.Root class="size-12 rounded-lg">
				<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" class="rounded-lg" />
				<Avatar.Fallback class="rounded-lg">SV</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root class="size-12 rounded-lg">
				<Avatar.Fallback class="rounded-lg">NP</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</section>

	<!-- 4 — colored fallbacks -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Colored fallbacks</h3>
			<p class="text-muted-foreground mt-1 text-xs">Initials only, tinted per person.</p>
		</div>
		<div class="flex items-center gap-4">
			<Avatar.Root>
				<Avatar.Fallback class="bg-rose-500/15 text-rose-600 {FALLBACK}">AB</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback class="bg-emerald-500/15 text-emerald-600 {FALLBACK}">CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback class="bg-sky-500/15 text-sky-600 {FALLBACK}">EF</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</section>

	<!-- 5 — stacked group -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Stacked group</h3>
			<p class="text-muted-foreground mt-1 text-xs">Overlap with negative spacing and a ring.</p>
		</div>
		<div class="flex -space-x-2">
			{#each team as person (person.alt)}
				<Avatar.Root class={RING}>
					<Avatar.Image src={person.src} alt={person.alt} />
					<Avatar.Fallback class={FALLBACK}>{person.initials}</Avatar.Fallback>
				</Avatar.Root>
			{/each}
			<Avatar.Root class={RING}>
				<Avatar.Fallback class="bg-muted text-muted-foreground {FALLBACK}">+5</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</section>

	<!-- 6 — broken image -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Broken image</h3>
			<p class="text-muted-foreground mt-1 text-xs">Falls back automatically when the src fails.</p>
		</div>
		<div class="flex items-center gap-4">
			<Avatar.Root class="size-12">
				<Avatar.Image src="https://example.com/does-not-exist.png" alt="Missing" />
				<Avatar.Fallback>MN</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</section>
</div>

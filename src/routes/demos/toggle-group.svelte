<script lang="ts">
	import * as ToggleGroup from '$lib/components/toggle-group/index';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import AlignStart from '@lucide/svelte/icons/text-align-start';
	import AlignCenter from '@lucide/svelte/icons/text-align-center';
	import AlignEnd from '@lucide/svelte/icons/text-align-end';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';

	// 1 — formatting toolbar (multiple)
	let formatting = $state<string[]>(['bold']);

	// 2 — alignment (single)
	let alignment = $state('center');

	// 3 — outline variant
	let outlineFmt = $state<string[]>(['italic']);

	// 4 — sizes
	let small = $state<string[]>(['bold']);
	let large = $state<string[]>(['underline']);

	// 5 — spacing + text
	let listStyle = $state('bullet');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default multiple -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Multiple selection, like a formatting toolbar.</p>
		</div>
		<ToggleGroup.Root type="multiple" bind:value={formatting}>
			<ToggleGroup.Item value="bold" aria-label="Toggle bold">
				<Bold class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Toggle italic">
				<Italic class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="underline" aria-label="Toggle underline">
				<Underline class="size-4" />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</section>

	<!-- 2 — single -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Single</h3>
			<p class="text-muted-foreground mt-1 text-xs">Only one item active at a time.</p>
		</div>
		<ToggleGroup.Root type="single" bind:value={alignment}>
			<ToggleGroup.Item value="start" aria-label="Align start">
				<AlignStart class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="center" aria-label="Align center">
				<AlignCenter class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="end" aria-label="Align end">
				<AlignEnd class="size-4" />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</section>

	<!-- 3 — outline -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Outline</h3>
			<p class="text-muted-foreground mt-1 text-xs">The bordered <code>outline</code> variant.</p>
		</div>
		<ToggleGroup.Root type="multiple" variant="outline" bind:value={outlineFmt}>
			<ToggleGroup.Item value="bold" aria-label="Toggle bold">
				<Bold class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Toggle italic">
				<Italic class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="underline" aria-label="Toggle underline">
				<Underline class="size-4" />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</section>

	<!-- 4 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Switch density with <code>size</code>.</p>
		</div>
		<div class="flex flex-col gap-3">
			<ToggleGroup.Root type="multiple" size="sm" variant="outline" bind:value={small}>
				<ToggleGroup.Item value="bold" aria-label="Toggle bold">
					<Bold class="size-4" />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="italic" aria-label="Toggle italic">
					<Italic class="size-4" />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="underline" aria-label="Toggle underline">
					<Underline class="size-4" />
				</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="multiple" size="lg" variant="outline" bind:value={large}>
				<ToggleGroup.Item value="bold" aria-label="Toggle bold">
					<Bold class="size-4" />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="italic" aria-label="Toggle italic">
					<Italic class="size-4" />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="underline" aria-label="Toggle underline">
					<Underline class="size-4" />
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	</section>

	<!-- 5 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">The whole group is non-interactive.</p>
		</div>
		<ToggleGroup.Root type="multiple" variant="outline" disabled value={['bold']}>
			<ToggleGroup.Item value="bold" aria-label="Toggle bold">
				<Bold class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Toggle italic">
				<Italic class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="underline" aria-label="Toggle underline">
				<Underline class="size-4" />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</section>

	<!-- 6 — spacing + text -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Spacing &amp; text</h3>
			<p class="text-muted-foreground mt-1 text-xs">Separated items with icon and label.</p>
		</div>
		<ToggleGroup.Root type="single" variant="outline" spacing={2} bind:value={listStyle}>
			<ToggleGroup.Item value="bullet" aria-label="Bullet list">
				<List class="size-4" />
				Bullet
			</ToggleGroup.Item>
			<ToggleGroup.Item value="numbered" aria-label="Numbered list">
				<ListOrdered class="size-4" />
				Numbered
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</section>
</div>

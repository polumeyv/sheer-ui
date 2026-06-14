<script lang="ts">
	import * as ScrollArea from '$lib/components/scroll-area/index';
	import { Separator } from '$lib/components/separator/index';
	import ImageIcon from '@lucide/svelte/icons/image';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const FRAME = 'rounded-md border';
	const FIGURE = 'shrink-0';
	const THUMB =
		'bg-muted text-muted-foreground flex aspect-[3/4] h-40 items-center justify-center overflow-hidden rounded-md';
	const CAPTION = 'text-muted-foreground pt-2 text-xs';

	// 1 — vertical tags list (the canonical example)
	const tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${i + 1}`);

	// 2 — horizontal image gallery
	type Artwork = { artist: string; title: string };
	const works: Artwork[] = [
		{ artist: 'Ornella Binni', title: 'Reflections' },
		{ artist: 'Tom Byrom', title: 'Daybreak' },
		{ artist: 'Vladimir Malyavko', title: 'Stillness' },
		{ artist: 'Annie Spratt', title: 'Foliage' },
		{ artist: 'Milad Fakurian', title: 'Gradient' },
		{ artist: 'Pawel Czerwinski', title: 'Ripples' }
	];

	// 3 — two-axis scroll (a wide, tall grid)
	const cells = Array.from({ length: 18 * 12 }, (_, i) => i + 1);

	// 5 — chat-style message list
	type Message = { from: 'them' | 'me'; text: string };
	const messages: Message[] = [
		{ from: 'them', text: 'Hey, did the deploy go through?' },
		{ from: 'me', text: 'Yep, just shipped v1.2.0-beta.50.' },
		{ from: 'them', text: 'Nice. Any regressions?' },
		{ from: 'me', text: 'None so far. Watching the dashboards.' },
		{ from: 'them', text: 'Cool, ping me if the error rate spikes.' },
		{ from: 'me', text: 'Will do. CPU is flat, memory looks healthy.' },
		{ from: 'them', text: 'Great. I will draft the release notes.' },
		{ from: 'me', text: 'Thanks — I added the changelog entries already.' },
		{ from: 'them', text: 'Perfect, less work for me.' },
		{ from: 'me', text: 'Always 😄' },
		{ from: 'them', text: 'Let us close the milestone then.' },
		{ from: 'me', text: 'Done. On to the next one.' }
	];

	// 6 — RTL direction
	const verses = Array.from({ length: 24 }, (_, i) => `السطر رقم ${i + 1}`);
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — vertical tags list -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical list</h3>
			<p class="text-muted-foreground mt-1 text-xs">Default vertical scrolling with separators.</p>
		</div>
		<ScrollArea.Root class="h-72 w-full max-w-xs {FRAME}">
			<div class="p-4">
				<h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
				{#each tags as tag (tag)}
					<div class="text-sm">{tag}</div>
					<Separator class="my-2" />
				{/each}
			</div>
		</ScrollArea.Root>
	</section>

	<!-- 2 — horizontal image gallery -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Horizontal gallery</h3>
			<p class="text-muted-foreground mt-1 text-xs">orientation="horizontal" for side-to-side scrolling.</p>
		</div>
		<ScrollArea.Root orientation="horizontal" class="w-full max-w-xl {FRAME} whitespace-nowrap">
			<div class="flex gap-4 p-4">
				{#each works as work (work.title)}
					<figure class={FIGURE}>
						<div class={THUMB}>
							<ImageIcon class="size-8" />
						</div>
						<figcaption class={CAPTION}>
							<span class="text-foreground font-medium">{work.title}</span> — {work.artist}
						</figcaption>
					</figure>
				{/each}
			</div>
		</ScrollArea.Root>
	</section>

	<!-- 3 — two-axis scroll -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Both axes</h3>
			<p class="text-muted-foreground mt-1 text-xs">orientation="both" scrolls vertically and horizontally.</p>
		</div>
		<ScrollArea.Root orientation="both" class="h-72 w-full max-w-xl {FRAME}">
			<div class="grid w-max grid-cols-18 gap-1 p-4">
				{#each cells as cell (cell)}
					<div class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-sm text-xs">
						{cell}
					</div>
				{/each}
			</div>
		</ScrollArea.Root>
	</section>

	<!-- 4 — always-visible scrollbar -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Always visible</h3>
			<p class="text-muted-foreground mt-1 text-xs">type="always" keeps the scrollbar shown at all times.</p>
		</div>
		<ScrollArea.Root type="always" class="h-72 w-full max-w-xs {FRAME}">
			<div class="p-4">
				<h4 class="mb-4 text-sm leading-none font-medium">Releases</h4>
				{#each tags as tag (tag)}
					<div class="text-sm">{tag}</div>
					<Separator class="my-2" />
				{/each}
			</div>
		</ScrollArea.Root>
	</section>

	<!-- 5 — chat message list -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Message thread</h3>
			<p class="text-muted-foreground mt-1 text-xs">A scrollable conversation, fixed-height container.</p>
		</div>
		<ScrollArea.Root class="h-72 w-full max-w-sm {FRAME}">
			<div class="flex flex-col gap-2 p-4">
				{#each messages as message, i (i)}
					<div class="flex {message.from === 'me' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[80%] rounded-lg px-3 py-2 text-sm {message.from === 'me'
								? 'bg-primary text-primary-foreground'
								: 'bg-muted text-foreground'}"
						>
							{message.text}
						</div>
					</div>
				{/each}
			</div>
		</ScrollArea.Root>
	</section>

	<!-- 6 — RTL direction -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Right-to-left</h3>
			<p class="text-muted-foreground mt-1 text-xs">dir="rtl" mirrors layout and scrollbar placement.</p>
		</div>
		<ScrollArea.Root dir="rtl" class="h-72 w-full max-w-xs {FRAME}">
			<div class="p-4 text-right" dir="rtl">
				<h4 class="mb-4 text-sm leading-none font-medium">الفهرس</h4>
				{#each verses as verse (verse)}
					<div class="text-sm">{verse}</div>
					<Separator class="my-2" />
				{/each}
			</div>
		</ScrollArea.Root>
	</section>
</div>

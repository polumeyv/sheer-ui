<script lang="ts">
	import * as Carousel from '$lib/components/carousel/index';
	import * as Card from '$lib/components/card/index';
	import type { CarouselAPI } from '$lib/components/carousel/carouselState.svelte';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const CARD_CONTENT = 'flex aspect-square items-center justify-center p-6';
	const NUM = 'text-4xl font-semibold';

	const slides = Array.from({ length: 5 }, (_, i) => i + 1);

	// 6 — API with slide counter + dot indicators.
	// `api` mutates outside Svelte's reactivity, so we mirror its selection into
	// `selectedIndex` via embla's `select` event; `count`/`current` derive from there.
	let api = $state.raw<CarouselAPI | undefined>(undefined);
	let selectedIndex = $state(0);
	const count = $derived(api?.scrollSnapList().length ?? 0);
	const current = $derived(selectedIndex + 1);

	$effect(() => {
		const embla = api;
		if (!embla) return;

		const onSelect = () => (selectedIndex = embla.selectedScrollSnap());
		onSelect();
		embla.on('select', onSelect).on('reInit', onSelect);

		return () => {
			embla.off('select', onSelect).off('reInit', onSelect);
		};
	});
</script>

<div class="flex w-full max-w-md flex-col gap-12">
	<!-- 1 — default horizontal -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Horizontal carousel with previous / next controls.
			</p>
		</div>
		<Carousel.Root class="w-full max-w-xs">
			<Carousel.Content>
				{#each slides as index (index)}
					<Carousel.Item>
						<Card.Root>
							<Card.Content class={CARD_CONTENT}>
								<span class={NUM}>{index}</span>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</section>

	<!-- 2 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Use <code>basis</code> on each item to show multiple slides at once.
			</p>
		</div>
		<Carousel.Root class="w-full max-w-xs">
			<Carousel.Content class="-ms-1">
				{#each slides as index (index)}
					<Carousel.Item class="ps-1 basis-1/2 md:basis-1/3">
						<Card.Root>
							<Card.Content class="flex aspect-square items-center justify-center p-6">
								<span class="text-3xl font-semibold">{index}</span>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</section>

	<!-- 3 — spacing -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Spacing</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Negative margin on content + padding on items widens the gap.
			</p>
		</div>
		<Carousel.Root class="w-full max-w-xs">
			<Carousel.Content class="-ms-2 md:-ms-4">
				{#each slides as index (index)}
					<Carousel.Item class="ps-2 md:ps-4 basis-1/2 lg:basis-1/3">
						<Card.Root>
							<Card.Content class="flex aspect-square items-center justify-center p-6">
								<span class="text-3xl font-semibold">{index}</span>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</section>

	<!-- 4 — vertical orientation -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				<code>orientation="vertical"</code> scrolls top to bottom.
			</p>
		</div>
		<Carousel.Root orientation="vertical" class="w-full max-w-xs">
			<Carousel.Content class="-mt-1 h-[200px]">
				{#each slides as index (index)}
					<Carousel.Item class="pt-1 basis-1/2">
						<Card.Root>
							<Card.Content class="flex items-center justify-center p-6">
								<span class={NUM}>{index}</span>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</section>

	<!-- 5 — options (loop + align) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Options</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Pass Embla settings via <code>opts</code>: <code>loop</code> and <code>align: "start"</code>.
			</p>
		</div>
		<Carousel.Root opts={{ align: 'start', loop: true }} class="w-full max-w-xs">
			<Carousel.Content>
				{#each slides as index (index)}
					<Carousel.Item class="md:basis-1/2">
						<Card.Root>
							<Card.Content class={CARD_CONTENT}>
								<span class={NUM}>{index}</span>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</section>

	<!-- 6 — API: counter + dot indicators -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With API</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Read the embla API via <code>setApi</code> for a counter and dots.
			</p>
		</div>
		<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="w-full max-w-xs">
			<Carousel.Content>
				{#each slides as index (index)}
					<Carousel.Item>
						<Card.Root>
							<Card.Content class={CARD_CONTENT}>
								<span class={NUM}>{index}</span>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
		<div class="flex items-center justify-center gap-3">
			<div class="flex gap-1.5">
				{#each Array.from({ length: count }, (_, i) => i) as i (i)}
					<button
						type="button"
						aria-label={`Go to slide ${i + 1}`}
						aria-current={current === i + 1}
						class={`size-2 rounded-full transition-colors ${
							current === i + 1 ? 'bg-primary' : 'bg-muted-foreground/30'
						}`}
						onclick={() => api?.scrollTo(i)}
					></button>
				{/each}
			</div>
			<span class="text-muted-foreground text-xs tabular-nums">
				Slide {current} of {count}
			</span>
		</div>
	</section>
</div>

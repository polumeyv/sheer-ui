<script lang="ts">
	import * as Carousel from '$lib/components/carousel/index';
	import * as Card from '$lib/components/card/index';

	let api = $state<ReturnType<typeof Object> | undefined>(undefined);
	let log = $state('waiting for api…');

	$effect(() => {
		if (!api) return;
		const a = api as any;
		// Programmatically CLICK the rendered Next button and see if selectedScrollSnap
		// advances (updates on target change, independent of the RAF animation).
		// Is RAF even running? (browsers pause requestAnimationFrame on hidden pages.)
		let rafCount = 0;
		const stopAt = 30;
		function counter() {
			if (++rafCount < stopAt) requestAnimationFrame(counter);
		}
		requestAnimationFrame(counter);
		a.scrollNext?.(); // ANIMATED scroll
		setTimeout(() => {
			log =
				`visibilityState=${document.visibilityState} hidden=${document.hidden} | ` +
				`rafFiresIn500ms=${rafCount} | sel=${a.selectedScrollSnap?.()}`;
		}, 500);
	});
</script>

<p class="p-4 font-mono text-xs" data-testid="log">{log}</p>
<div class="flex min-h-[24rem] w-full items-center justify-center rounded-xl border border-border p-10">
	<Carousel.Root class="w-full max-w-xs" setApi={(a) => (api = a)}>
		<Carousel.Content>
			{#each [1, 2, 3, 4, 5] as index (index)}
				<Carousel.Item>
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-6">
							<span class="text-4xl font-semibold">{index}</span>
						</Card.Content>
					</Card.Root>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>

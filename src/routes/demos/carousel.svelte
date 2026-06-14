<script lang="ts">
	import * as Carousel from '$lib/components/carousel/index';
	import * as Card from '$lib/components/card/index';
</script>

<Carousel.Root orientation="vertical" class="w-full max-w-xs">
	<Carousel.Content>
		{#each Array.from({ length: 5 }, (_, i) => i + 1) as index (index)}
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

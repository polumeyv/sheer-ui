<script lang="ts" module>
	export const title = 'Multiple items';
</script>

<script lang="ts">
	import * as Carousel from '../../lib/components/carousel/index.js';
	import * as Card from '../../lib/components/card/index.js';
</script>

<Carousel.Root class="w-full max-w-sm">
	<Carousel.Content>
		{#each Array.from({ length: 9 }, (_, i) => i + 1) as n (n)}
			<Carousel.Item class="basis-1/3!">
				<Card.Root>
					<Card.Content class="grid aspect-square place-items-center p-6">
						<span class="text-2xl font-semibold">{n}</span>
					</Card.Content>
				</Card.Root>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>

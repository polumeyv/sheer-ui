<script lang="ts" module>
	export const title = 'Vertical';
</script>

<script lang="ts">
	import * as Carousel from '../../lib/components/carousel/index.js';
	import * as Card from '../../lib/components/card/index.js';
</script>

<div class="w-full max-w-xs py-12">
	<Carousel.Root orientation="vertical" class="w-full">
		<Carousel.Content class="h-80">
			{#each Array.from({ length: 5 }, (_, i) => i + 1) as n (n)}
				<Carousel.Item class="basis-1/2!">
					<Card.Root class="h-full">
						<Card.Content class="grid h-full place-items-center p-6">
							<span class="text-3xl font-semibold">{n}</span>
						</Card.Content>
					</Card.Root>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>

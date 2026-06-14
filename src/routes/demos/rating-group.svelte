<script lang="ts">
	import { RatingGroup } from '$lib/components/rating-group/index';
	import Star from '@lucide/svelte/icons/star';
	import StarHalf from '@lucide/svelte/icons/star-half';

	let value = $state(3);
</script>

<div class="flex flex-col items-center gap-3">
	<RatingGroup.Root bind:value max={5} class="flex items-center gap-1">
		{#snippet children({ items })}
			{#each items as item (item.index)}
				<RatingGroup.Item index={item.index} class="cursor-pointer">
					{#if item.state === 'active'}
						<Star class="size-6 fill-yellow-400 text-yellow-400" />
					{:else if item.state === 'partial'}
						<StarHalf class="size-6 fill-yellow-400 text-yellow-400" />
					{:else}
						<Star class="text-muted-foreground size-6" />
					{/if}
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>

	<p class="text-muted-foreground text-sm">
		{value} out of 5 stars
	</p>
</div>

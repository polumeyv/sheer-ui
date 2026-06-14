<script lang="ts">
	import * as HoverCard from '$lib/components/hover-card/index';
	import * as Avatar from '$lib/components/avatar/index';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
</script>

<HoverCard.Root>
	<HoverCard.Trigger
		href="https://svelte.dev"
		target="_blank"
		rel="noreferrer noopener"
		class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2"
	>
		@sveltejs
	</HoverCard.Trigger>
	<HoverCard.Content class="w-80">
		<div class="flex justify-between gap-4">
			<Avatar.Root>
				<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
				<Avatar.Fallback>SV</Avatar.Fallback>
			</Avatar.Root>
			<div class="space-y-1">
				<h4 class="text-sm font-semibold">@sveltejs</h4>
				<p class="text-sm">Cybernetically enhanced web apps.</p>
				<div class="text-muted-foreground flex items-center pt-2 text-xs">
					<CalendarIcon class="mr-2 size-4 opacity-70" />
					<span>Joined September 2016</span>
				</div>
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>

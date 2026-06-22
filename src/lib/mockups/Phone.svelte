<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, nav }: { children?: Snippet; nav?: Snippet } = $props();
</script>

<div class="relative">
	<!-- Side buttons -->
	<div class="absolute w-0.5 bg-foreground/20 rounded-md top-9/50 h-1/25 left-[-2.5px]"></div>
	<div class="absolute w-0.5 bg-foreground/20 rounded-md top-13/50 h-2/25 left-[-2.5px]"></div>
	<div class="absolute w-0.5 bg-foreground/20 rounded-md top-18/50 h-2/25 left-[-2.5px]"></div>
	<div class="absolute w-0.5 bg-foreground/20 rounded-md top-7/25 h-1/10 -right-0.5"></div>

	<!-- Phone outer frame -->
	<div class="aspect-9.5/19.5 rounded-(--card-radius) bg-foreground/20 p-(--card-padding) [--card-radius:3.2rem] [--card-padding:--spacing(.50)]">
		<!-- Black bezel -->
		<div class="size-full rounded-[calc(var(--card-radius)-var(--card-padding))] p-(--card-bezel-padding) bg-black [--card-bezel-padding:calc(var(--card-padding)*2.5)]">
			<!-- Screen -->
			<div class="size-full rounded-[calc(var(--card-radius)-var(--card-padding)-(var(--card-bezel-padding)))] bg-muted/90 overflow-hidden flex flex-col">
				<!-- Dynamic Island -->
				<div class="pt-2 flex justify-center shrink-10">
					<div class="w-1/3 h-6 bg-background rounded-full"></div>
				</div>

				<!-- Content -->
				<div class="h-full overflow-hidden">
					{@render children?.()}
				</div>

				<!-- Nav bar -->
				{#if nav}
					<div class="flex justify-around py-[calc(var(--card-bezel-padding)*2)]">
						{@render nav()}
					</div>
				{/if}

				<!-- Home indicator -->
				<div class="py-(--card-bezel-padding) flex justify-center shrink-0">
					<div class="w-1/3 h-1 bg-foreground/10 rounded-full"></div>
				</div>
			</div>
		</div>
	</div>
</div>

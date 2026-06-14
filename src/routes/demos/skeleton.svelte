<script lang="ts">
	import { Skeleton } from '$lib/components/skeleton/index';

	// Shared wrappers, factored out so each example stays copy-paste sized.
	const CARD = 'rounded-xl border p-4';
	const ROW = 'flex items-center gap-4';
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — avatar with text lines -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Avatar with text</h3>
			<p class="text-muted-foreground mt-1 text-xs">Circular avatar beside two text lines.</p>
		</div>
		<div class={ROW}>
			<Skeleton class="size-12 rounded-full" />
			<div class="space-y-2">
				<Skeleton class="h-4 w-[250px]" />
				<Skeleton class="h-4 w-[200px]" />
			</div>
		</div>
	</section>

	<!-- 2 — card -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Card</h3>
			<p class="text-muted-foreground mt-1 text-xs">Image placeholder above two text lines.</p>
		</div>
		<div class="flex flex-col space-y-3">
			<Skeleton class="h-[125px] w-full rounded-xl" />
			<div class="space-y-2">
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-3/4" />
			</div>
		</div>
	</section>

	<!-- 3 — paragraph / text block -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Text block</h3>
			<p class="text-muted-foreground mt-1 text-xs">Stacked lines with a shorter last row.</p>
		</div>
		<div class="space-y-2">
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-5/6" />
			<Skeleton class="h-4 w-2/3" />
		</div>
	</section>

	<!-- 4 — list -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">List</h3>
			<p class="text-muted-foreground mt-1 text-xs">Repeated avatar rows for a feed.</p>
		</div>
		<div class="space-y-4">
			{#each Array(3) as _, i (i)}
				<div class={ROW}>
					<Skeleton class="size-10 rounded-full" />
					<div class="flex-1 space-y-2">
						<Skeleton class="h-3 w-3/5" />
						<Skeleton class="h-3 w-2/5" />
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- 5 — form -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Form</h3>
			<p class="text-muted-foreground mt-1 text-xs">Labels, inputs and a submit button.</p>
		</div>
		<div class={CARD}>
			<div class="space-y-4">
				<div class="space-y-2">
					<Skeleton class="h-3 w-16" />
					<Skeleton class="h-9 w-full rounded-md" />
				</div>
				<div class="space-y-2">
					<Skeleton class="h-3 w-20" />
					<Skeleton class="h-9 w-full rounded-md" />
				</div>
				<Skeleton class="h-9 w-24 rounded-md" />
			</div>
		</div>
	</section>

	<!-- 6 — table -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Table</h3>
			<p class="text-muted-foreground mt-1 text-xs">Header row above placeholder data rows.</p>
		</div>
		<div class="overflow-hidden rounded-md border">
			<div class="bg-muted/50 flex items-center gap-4 border-b px-4 py-3">
				<Skeleton class="h-3 w-1/4" />
				<Skeleton class="h-3 w-1/4" />
				<Skeleton class="ms-auto h-3 w-16" />
			</div>
			{#each Array(4) as _, i (i)}
				<div class="flex items-center gap-4 px-4 py-3 not-last:border-b">
					<Skeleton class="h-3 w-1/4" />
					<Skeleton class="h-3 w-1/3" />
					<Skeleton class="ms-auto h-3 w-16" />
				</div>
			{/each}
		</div>
	</section>
</div>

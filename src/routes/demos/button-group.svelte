<script lang="ts">
	import * as ButtonGroup from '$lib/components/button-group/index';
	import { Button } from '$lib/components/button/index';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Plus from '@lucide/svelte/icons/plus';
	import Minus from '@lucide/svelte/icons/minus';
	import Search from '@lucide/svelte/icons/search';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import SkipBack from '@lucide/svelte/icons/skip-back';
	import SkipForward from '@lucide/svelte/icons/skip-forward';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const INPUT =
		'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 min-w-0 flex-1 border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

	// 1 — text formatting toolbar (icon buttons)
	let marks = $state({ bold: false, italic: false, underline: false });

	// 2 — quantity stepper (vertical orientation)
	let quantity = $state(1);

	// 3 — pagination (nested groups + text + separator)
	const totalPages = 8;
	let page = $state(1);

	// 4 — search field wrapped with a button
	let query = $state('');

	// 5 — media controls (vertical)
	let playing = $state(false);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — icon toolbar -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Icon toolbar</h3>
			<p class="text-muted-foreground mt-1 text-xs">Grouped icon buttons that toggle on click.</p>
		</div>
		<ButtonGroup.Root>
			<Button
				variant="outline"
				size="icon"
				aria-label="Bold"
				aria-pressed={marks.bold}
				onclick={() => (marks.bold = !marks.bold)}
			>
				<Bold />
			</Button>
			<Button
				variant="outline"
				size="icon"
				aria-label="Italic"
				aria-pressed={marks.italic}
				onclick={() => (marks.italic = !marks.italic)}
			>
				<Italic />
			</Button>
			<Button
				variant="outline"
				size="icon"
				aria-label="Underline"
				aria-pressed={marks.underline}
				onclick={() => (marks.underline = !marks.underline)}
			>
				<Underline />
			</Button>
		</ButtonGroup.Root>
	</section>

	<!-- 2 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Small, default and large button groups.</p>
		</div>
		<div class="flex flex-col items-start gap-3">
			<ButtonGroup.Root>
				<Button variant="outline" size="sm">Prev</Button>
				<Button variant="outline" size="sm">Next</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline" size="default">Prev</Button>
				<Button variant="outline" size="default">Next</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="outline" size="lg">Prev</Button>
				<Button variant="outline" size="lg">Next</Button>
			</ButtonGroup.Root>
		</div>
	</section>

	<!-- 3 — pagination -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Pagination</h3>
			<p class="text-muted-foreground mt-1 text-xs">Text and Separator between navigation arrows.</p>
		</div>
		<ButtonGroup.Root>
			<Button
				variant="outline"
				size="icon"
				aria-label="Previous page"
				disabled={page <= 1}
				onclick={() => (page = Math.max(1, page - 1))}
			>
				<ChevronLeft />
			</Button>
			<ButtonGroup.Separator />
			<ButtonGroup.Text>Page {page} of {totalPages}</ButtonGroup.Text>
			<ButtonGroup.Separator />
			<Button
				variant="outline"
				size="icon"
				aria-label="Next page"
				disabled={page >= totalPages}
				onclick={() => (page = Math.min(totalPages, page + 1))}
			>
				<ChevronRight />
			</Button>
		</ButtonGroup.Root>
	</section>

	<!-- 4 — split button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Split button</h3>
			<p class="text-muted-foreground mt-1 text-xs">Primary action plus a secondary trigger.</p>
		</div>
		<ButtonGroup.Root>
			<Button variant="default">Save</Button>
			<ButtonGroup.Separator />
			<Button variant="default" size="icon" aria-label="More save options">
				<ChevronDown />
			</Button>
		</ButtonGroup.Root>
	</section>

	<!-- 5 — quantity stepper (vertical) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical orientation</h3>
			<p class="text-muted-foreground mt-1 text-xs">Stack buttons with orientation="vertical".</p>
		</div>
		<div class="flex items-center gap-3">
			<ButtonGroup.Root orientation="vertical">
				<Button variant="outline" size="icon" aria-label="Increment" onclick={() => (quantity += 1)}>
					<Plus />
				</Button>
				<Button
					variant="outline"
					size="icon"
					aria-label="Decrement"
					disabled={quantity <= 0}
					onclick={() => (quantity = Math.max(0, quantity - 1))}
				>
					<Minus />
				</Button>
			</ButtonGroup.Root>
			<span class="text-sm tabular-nums">Qty: {quantity}</span>
		</div>
	</section>

	<!-- 6 — search field -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Input + button</h3>
			<p class="text-muted-foreground mt-1 text-xs">Wrap an input with a trailing action button.</p>
		</div>
		<ButtonGroup.Root>
			<input bind:value={query} placeholder="Search…" aria-label="Search" class={INPUT} />
			<Button variant="outline" size="icon" aria-label="Submit search">
				<Search />
			</Button>
		</ButtonGroup.Root>
	</section>

	<!-- 7 — media controls -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Media controls</h3>
			<p class="text-muted-foreground mt-1 text-xs">A toolbar of secondary icon buttons.</p>
		</div>
		<ButtonGroup.Root>
			<Button variant="secondary" size="icon" aria-label="Previous track">
				<SkipBack />
			</Button>
			<Button
				variant="secondary"
				size="icon"
				aria-label={playing ? 'Pause' : 'Play'}
				onclick={() => (playing = !playing)}
			>
				{#if playing}
					<Pause />
				{:else}
					<Play />
				{/if}
			</Button>
			<Button variant="secondary" size="icon" aria-label="Next track">
				<SkipForward />
			</Button>
		</ButtonGroup.Root>
	</section>
</div>

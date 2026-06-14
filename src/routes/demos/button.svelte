<script lang="ts">
	import { Button } from '$lib/components/button/index';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';

	// Shared layout class for example rows, factored out so each stays copy-paste sized.
	const ROW = 'flex flex-wrap items-center gap-3';

	// Loading example — toggle a pending state on click.
	let loading = $state(false);
	function submit() {
		loading = true;
		setTimeout(() => (loading = false), 1500);
	}
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — variants -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Variants</h3>
			<p class="text-muted-foreground mt-1 text-xs">The full set of visual styles.</p>
		</div>
		<div class={ROW}>
			<Button>Default</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="link">Link</Button>
		</div>
	</section>

	<!-- 2 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">From xs to lg via the size prop.</p>
		</div>
		<div class={ROW}>
			<Button size="xs">Extra small</Button>
			<Button size="sm">Small</Button>
			<Button size="default">Default</Button>
			<Button size="lg">Large</Button>
		</div>
	</section>

	<!-- 3 — with icon -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icon</h3>
			<p class="text-muted-foreground mt-1 text-xs">Pair a label with a leading or trailing icon.</p>
		</div>
		<div class={ROW}>
			<Button>
				<PlusIcon />
				New item
			</Button>
			<Button variant="outline">
				Continue
				<ArrowRightIcon />
			</Button>
			<Button variant="destructive">
				<Trash2Icon />
				Delete
			</Button>
		</div>
	</section>

	<!-- 4 — icon only -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Icon only</h3>
			<p class="text-muted-foreground mt-1 text-xs">Square icon buttons in each size.</p>
		</div>
		<div class={ROW}>
			<Button size="icon-sm" variant="outline" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon" variant="outline" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon-lg" variant="outline" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon" variant="ghost" class="rounded-full" aria-label="Add">
				<PlusIcon />
			</Button>
		</div>
	</section>

	<!-- 5 — loading -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Loading</h3>
			<p class="text-muted-foreground mt-1 text-xs">Disable and show a spinner while pending.</p>
		</div>
		<div class={ROW}>
			<Button disabled={loading} onclick={submit}>
				{#if loading}
					<LoaderCircleIcon class="animate-spin" />
					Please wait
				{:else}
					Save changes
				{/if}
			</Button>
		</div>
	</section>

	<!-- 6 — as link -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled & as link</h3>
			<p class="text-muted-foreground mt-1 text-xs">A disabled button and an anchor via href.</p>
		</div>
		<div class={ROW}>
			<Button disabled>Disabled</Button>
			<Button href="#" variant="outline">
				Visit docs
				<ArrowRightIcon />
			</Button>
		</div>
	</section>
</div>

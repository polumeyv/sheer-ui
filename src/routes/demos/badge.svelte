<script lang="ts">
	import { Badge } from '$lib/components/badge/index';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import CheckIcon from '@lucide/svelte/icons/check';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	// Shared layout class, factored out so each example stays copy-paste sized.
	const ROW = 'flex flex-wrap items-center gap-2';
	// Tabular numerals + min size keeps single/double digit count badges balanced.
	const COUNT = 'h-5 min-w-5 justify-center rounded-full px-1 font-mono tabular-nums';
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — variants -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Variants</h3>
			<p class="text-muted-foreground mt-1 text-xs">The built-in styles.</p>
		</div>
		<div class={ROW}>
			<Badge>Badge</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	</section>

	<!-- 2 — with icon -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icon</h3>
			<p class="text-muted-foreground mt-1 text-xs">SVGs auto-size to the label.</p>
		</div>
		<div class={ROW}>
			<Badge variant="secondary">
				<BadgeCheckIcon />
				Verified
			</Badge>
			<Badge>
				<CheckIcon />
				Done
			</Badge>
			<Badge variant="destructive">
				<CircleAlertIcon />
				Failed
			</Badge>
		</div>
	</section>

	<!-- 3 — numeric / count -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Count</h3>
			<p class="text-muted-foreground mt-1 text-xs">Circular badges for numbers.</p>
		</div>
		<div class={ROW}>
			<Badge class={COUNT}>8</Badge>
			<Badge variant="destructive" class={COUNT}>99</Badge>
			<Badge variant="outline" class={COUNT}>20+</Badge>
		</div>
	</section>

	<!-- 4 — as a link -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">As a link</h3>
			<p class="text-muted-foreground mt-1 text-xs">Pass <code>href</code> to render an anchor.</p>
		</div>
		<div class={ROW}>
			<Badge href="##" variant="outline">
				Docs
				<ArrowRightIcon />
			</Badge>
			<Badge href="##">New release</Badge>
		</div>
	</section>

	<!-- 5 — tier colors -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Tier colors</h3>
			<p class="text-muted-foreground mt-1 text-xs">Custom bronze, gold and platinum variants.</p>
		</div>
		<div class={ROW}>
			<Badge variant="bronze">Bronze</Badge>
			<Badge variant="gold">
				<TrendingUpIcon />
				Gold
			</Badge>
			<Badge variant="platinum">Platinum</Badge>
		</div>
	</section>
</div>

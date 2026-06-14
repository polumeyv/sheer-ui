<script lang="ts">
	import { Separator } from '$lib/components/separator/index';

	// Shared styling, factored out so each example stays copy-paste sized.
	const TITLE = 'text-sm leading-none font-medium';
	const DESC = 'text-muted-foreground text-sm';
	const NAV_ROW = 'flex h-5 items-center gap-4 text-sm';
	const LABEL = 'text-muted-foreground text-xs uppercase';
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default (horizontal + vertical), straight from the docs -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Horizontal divider above a row split by vertical separators.
			</p>
		</div>
		<div class="w-full max-w-sm">
			<div class="space-y-1">
				<h4 class={TITLE}>Radix Primitives</h4>
				<p class={DESC}>An open-source UI component library.</p>
			</div>
			<Separator class="my-4" />
			<div class={NAV_ROW}>
				<span>Blog</span>
				<Separator orientation="vertical" />
				<span>Docs</span>
				<Separator orientation="vertical" />
				<span>Source</span>
			</div>
		</div>
	</section>

	<!-- 2 — horizontal between stacked content -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Horizontal list</h3>
			<p class="text-muted-foreground mt-1 text-xs">Rows divided by horizontal rules.</p>
		</div>
		<div class="w-full max-w-sm text-sm">
			<div class="py-2">Profile</div>
			<Separator />
			<div class="py-2">Billing</div>
			<Separator />
			<div class="py-2">Notifications</div>
		</div>
	</section>

	<!-- 3 — vertical toolbar -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical toolbar</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Inline actions separated with <code>orientation="vertical"</code>.
			</p>
		</div>
		<div class="flex h-9 items-center gap-3 rounded-md border px-3 text-sm">
			<button type="button" class="hover:text-foreground">Cut</button>
			<Separator orientation="vertical" />
			<button type="button" class="hover:text-foreground">Copy</button>
			<Separator orientation="vertical" />
			<button type="button" class="hover:text-foreground">Paste</button>
		</div>
	</section>

	<!-- 4 — labelled divider ("or") -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With label</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A separator flanking centered text, e.g. an "or" divider.
			</p>
		</div>
		<div class="w-full max-w-sm">
			<div class="flex items-center gap-3">
				<Separator class="flex-1" />
				<span class={LABEL}>or</span>
				<Separator class="flex-1" />
			</div>
		</div>
	</section>

	<!-- 5 — stat blocks with vertical separators -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Stat group</h3>
			<p class="text-muted-foreground mt-1 text-xs">Vertical separators between metrics.</p>
		</div>
		<div class="flex h-12 items-center gap-6 rounded-md border px-4">
			<div class="text-center">
				<div class="text-sm font-medium">1.2k</div>
				<div class="text-muted-foreground text-xs">Stars</div>
			</div>
			<Separator orientation="vertical" />
			<div class="text-center">
				<div class="text-sm font-medium">320</div>
				<div class="text-muted-foreground text-xs">Forks</div>
			</div>
			<Separator orientation="vertical" />
			<div class="text-center">
				<div class="text-sm font-medium">48</div>
				<div class="text-muted-foreground text-xs">Issues</div>
			</div>
		</div>
	</section>

	<!-- 6 — non-decorative (semantic) separator -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Semantic</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				<code>decorative={false}</code> exposes it as a real divider to assistive tech.
			</p>
		</div>
		<div class="w-full max-w-sm text-sm">
			<p class="text-muted-foreground">Section one content.</p>
			<Separator decorative={false} class="my-4" />
			<p class="text-muted-foreground">Section two content.</p>
		</div>
	</section>
</div>

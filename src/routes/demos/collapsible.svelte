<script lang="ts">
	import * as Collapsible from '$lib/components/collapsible/index';
	import { Button } from '$lib/components/button/index';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Plus from '@lucide/svelte/icons/plus';
	import Lock from '@lucide/svelte/icons/lock';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const ROOT = 'flex w-full max-w-sm flex-col gap-2';
	const ITEM = 'rounded-md border px-4 py-2 font-mono text-sm';
	const FAQ_TRIGGER =
		'group flex w-full items-center justify-between gap-4 rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/50';
	const FAQ_CHEVRON =
		'size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180';

	// 1 — starred repositories (the canonical shadcn example)
	let starred = $state(false);

	// 2 — FAQ list, each row a self-contained collapsible
	const faqs = [
		{
			q: 'Is it accessible?',
			a: 'Yes. It follows the WAI-ARIA disclosure pattern and is keyboard navigable.'
		},
		{
			q: 'Can I animate it?',
			a: 'The content panel exposes open state via data attributes you can target with CSS.'
		},
		{
			q: 'Is it styled?',
			a: 'No. It ships unstyled so you can bring your own design tokens.'
		}
	];

	// 4 — open by default
	let details = $state(true);

	// 5 — show more / less notifications
	let notifications = $state(false);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Toggle a panel with an icon button.</p>
		</div>
		<Collapsible.Root bind:open={starred} class={ROOT}>
			<div class="flex items-center justify-between gap-4 px-1">
				<h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" class="size-8">
							<ChevronsUpDown />
							<span class="sr-only">Toggle</span>
						</Button>
					{/snippet}
				</Collapsible.Trigger>
			</div>
			<div class={ITEM}>@sveltejs/svelte</div>
			<Collapsible.Content class="flex flex-col gap-2">
				<div class={ITEM}>@sveltejs/kit</div>
				<div class={ITEM}>@bits-ui/bits-ui</div>
			</Collapsible.Content>
		</Collapsible.Root>
	</section>

	<!-- 2 — FAQ list -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">FAQ list</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Full-width triggers with a chevron that rotates on open.
			</p>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-2">
			{#each faqs as faq (faq.q)}
				<Collapsible.Root class="flex flex-col gap-2">
					<Collapsible.Trigger class={FAQ_TRIGGER}>
						{faq.q}
						<ChevronDown class={FAQ_CHEVRON} />
					</Collapsible.Trigger>
					<Collapsible.Content class="text-muted-foreground px-4 pb-2 text-sm">
						{faq.a}
					</Collapsible.Content>
				</Collapsible.Root>
			{/each}
		</div>
	</section>

	<!-- 3 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Locked: the trigger cannot be toggled.</p>
		</div>
		<Collapsible.Root disabled class={ROOT}>
			<div class="flex items-center justify-between gap-4 px-1">
				<h4 class="text-sm font-semibold">Archived workspace</h4>
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" class="size-8">
							<Lock />
							<span class="sr-only">Locked</span>
						</Button>
					{/snippet}
				</Collapsible.Trigger>
			</div>
			<div class={ITEM}>read-only access</div>
			<Collapsible.Content class="flex flex-col gap-2">
				<div class={ITEM}>hidden details</div>
			</Collapsible.Content>
		</Collapsible.Root>
	</section>

	<!-- 4 — open by default + stateful trigger label -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Open by default</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Initial <code class="font-mono">open</code> with a label driven by content state.
			</p>
		</div>
		<Collapsible.Root bind:open={details} class={ROOT}>
			<Collapsible.Trigger class={FAQ_TRIGGER}>
				Build details
				<ChevronDown class={FAQ_CHEVRON} />
			</Collapsible.Trigger>
			<Collapsible.Content>
				{#snippet child({ props, open })}
					<div {...props} class="text-muted-foreground flex flex-col gap-2 px-1 pt-1 text-sm">
						<div class={ITEM}>status: {open ? 'passing' : 'unknown'}</div>
						<div class={ITEM}>duration: 42s</div>
						<div class={ITEM}>commit: a1b2c3d</div>
					</div>
				{/snippet}
			</Collapsible.Content>
		</Collapsible.Root>
	</section>

	<!-- 5 — show more / less -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Show more</h3>
			<p class="text-muted-foreground mt-1 text-xs">A text trigger whose label reflects state.</p>
		</div>
		<Collapsible.Root bind:open={notifications} class={ROOT}>
			<div class={ITEM}>3 new mentions</div>
			<div class={ITEM}>1 review requested</div>
			<Collapsible.Content class="flex flex-col gap-2">
				<div class={ITEM}>2 issues assigned</div>
				<div class={ITEM}>5 CI runs finished</div>
			</Collapsible.Content>
			<Collapsible.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="sm" class="w-full">
						<Plus class="transition-transform duration-200 {notifications ? 'rotate-45' : ''}" />
						{notifications ? 'Show less' : 'Show 2 more'}
					</Button>
				{/snippet}
			</Collapsible.Trigger>
		</Collapsible.Root>
	</section>
</div>

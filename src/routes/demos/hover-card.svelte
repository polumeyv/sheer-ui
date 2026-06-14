<script lang="ts">
	import * as HoverCard from '$lib/components/hover-card/index';
	import * as Avatar from '$lib/components/avatar/index';
	import { Button } from '$lib/components/button/index';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const LINK =
		'rounded-sm underline-offset-4 hover:underline focus-visible:outline-2';

	// 5 — controlled open state
	let open = $state(false);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — profile preview (link trigger) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Profile preview</h3>
			<p class="text-muted-foreground mt-1 text-xs">A link trigger that previews an account.</p>
		</div>
		<HoverCard.Root>
			<HoverCard.Trigger
				href="https://svelte.dev"
				target="_blank"
				rel="noreferrer noopener"
				class={LINK}
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
	</section>

	<!-- 2 — button trigger -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Button trigger</h3>
			<p class="text-muted-foreground mt-1 text-xs">Use the child snippet to trigger from a button.</p>
		</div>
		<HoverCard.Root>
			<HoverCard.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>@nextjs</Button>
				{/snippet}
			</HoverCard.Trigger>
			<HoverCard.Content class="w-72">
				<div class="space-y-1">
					<h4 class="text-sm font-semibold">The React Framework</h4>
					<p class="text-muted-foreground text-sm">
						Hover the button to preview details without leaving the page.
					</p>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	</section>

	<!-- 3 — placement -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Placement</h3>
			<p class="text-muted-foreground mt-1 text-xs">side, align and sideOffset position the card.</p>
		</div>
		<HoverCard.Root>
			<HoverCard.Trigger href="#" class={LINK}>Open to the right</HoverCard.Trigger>
			<HoverCard.Content side="right" align="start" sideOffset={8} class="w-64">
				<p class="text-sm">
					This card is anchored to the <span class="font-medium">right</span>, aligned to the
					trigger's start edge.
				</p>
			</HoverCard.Content>
		</HoverCard.Root>
	</section>

	<!-- 4 — timing -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Timing</h3>
			<p class="text-muted-foreground mt-1 text-xs">openDelay and closeDelay tune responsiveness.</p>
		</div>
		<HoverCard.Root openDelay={0} closeDelay={600}>
			<HoverCard.Trigger href="#" class={LINK}>Instant open</HoverCard.Trigger>
			<HoverCard.Content class="w-64">
				<p class="text-sm">
					Opens immediately on hover and lingers for 600ms after you leave.
				</p>
			</HoverCard.Content>
		</HoverCard.Root>
	</section>

	<!-- 5 — controlled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Bind open to drive and observe the state.</p>
		</div>
		<HoverCard.Root bind:open>
			<HoverCard.Trigger href="#" class={LINK}>Watch the state</HoverCard.Trigger>
			<HoverCard.Content class="w-64">
				<p class="text-sm">This content is open because the bound state is true.</p>
			</HoverCard.Content>
		</HoverCard.Root>
		<p class="text-muted-foreground text-xs">
			open: <span class="text-foreground font-medium">{open}</span>
		</p>
	</section>

	<!-- 6 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">A disabled root never opens on hover.</p>
		</div>
		<HoverCard.Root disabled>
			<HoverCard.Trigger href="#" class="{LINK} pointer-events-none opacity-50">
				No preview
			</HoverCard.Trigger>
			<HoverCard.Content class="w-64">
				<p class="text-sm">You will never see this.</p>
			</HoverCard.Content>
		</HoverCard.Root>
	</section>
</div>

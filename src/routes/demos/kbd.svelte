<script lang="ts">
	import * as Kbd from '$lib/components/kbd/index';
	import * as Tooltip from '$lib/components/tooltip/index';
	import { Button } from '$lib/components/button/index';
	import SaveIcon from '@lucide/svelte/icons/save';
	import PrinterIcon from '@lucide/svelte/icons/printer';

	// Shared title + description styling, factored out so each example stays copy-paste sized.
	const TITLE = 'text-sm leading-none font-medium';
	const DESC = 'text-muted-foreground mt-1 text-xs';
</script>

<div class="flex w-full max-w-xl flex-col gap-10">
	<!-- 1 — single key -->
	<section class="space-y-2">
		<div>
			<h3 class={TITLE}>Single key</h3>
			<p class={DESC}>One key per Root, the smallest unit.</p>
		</div>
		<div class="flex items-center gap-2">
			<Kbd.Root>B</Kbd.Root>
			<Kbd.Root>Esc</Kbd.Root>
			<Kbd.Root>Enter</Kbd.Root>
			<Kbd.Root>⌘</Kbd.Root>
		</div>
	</section>

	<!-- 2 — key combination -->
	<section class="space-y-2">
		<div>
			<h3 class={TITLE}>Key combination</h3>
			<p class={DESC}>Group several keys into one shortcut.</p>
		</div>
		<div class="flex flex-wrap items-center gap-4">
			<Kbd.Group>
				<Kbd.Root>Ctrl</Kbd.Root>
				<Kbd.Root>Shift</Kbd.Root>
				<Kbd.Root>P</Kbd.Root>
			</Kbd.Group>
			<Kbd.Group>
				<Kbd.Root>⌘</Kbd.Root>
				<span class="text-muted-foreground text-xs">+</span>
				<Kbd.Root>K</Kbd.Root>
			</Kbd.Group>
		</div>
	</section>

	<!-- 3 — inline within text -->
	<section class="space-y-2">
		<div>
			<h3 class={TITLE}>Inline with text</h3>
			<p class={DESC}>Embed keys inside a sentence.</p>
		</div>
		<p class="text-muted-foreground text-sm">
			Press <Kbd.Root>Esc</Kbd.Root> to close, or <Kbd.Group>
				<Kbd.Root>Ctrl</Kbd.Root>
				<Kbd.Root>S</Kbd.Root>
			</Kbd.Group> to save your work.
		</p>
	</section>

	<!-- 4 — inside a button -->
	<section class="space-y-2">
		<div>
			<h3 class={TITLE}>In a button</h3>
			<p class={DESC}>Surface the shortcut alongside the action.</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<Button variant="outline" size="sm">
				Search
				<Kbd.Root class="ms-2">⌘K</Kbd.Root>
			</Button>
			<Button variant="outline" size="sm">
				Save
				<Kbd.Group class="ms-2">
					<Kbd.Root>⌘</Kbd.Root>
					<Kbd.Root>S</Kbd.Root>
				</Kbd.Group>
			</Button>
		</div>
	</section>

	<!-- 5 — inside a tooltip -->
	<section class="space-y-2">
		<div>
			<h3 class={TITLE}>In a tooltip</h3>
			<p class={DESC}>Reveal the shortcut on hover.</p>
		</div>
		<Tooltip.Provider delayDuration={200}>
			<div class="flex flex-wrap items-center gap-3">
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="icon">
								<SaveIcon />
								<span class="sr-only">Save</span>
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content class="flex items-center gap-2">
						Save
						<Kbd.Group>
							<Kbd.Root>⌘</Kbd.Root>
							<Kbd.Root>S</Kbd.Root>
						</Kbd.Group>
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="icon">
								<PrinterIcon />
								<span class="sr-only">Print</span>
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content class="flex items-center gap-2">
						Print
						<Kbd.Group>
							<Kbd.Root>⌘</Kbd.Root>
							<Kbd.Root>P</Kbd.Root>
						</Kbd.Group>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</Tooltip.Provider>
	</section>
</div>

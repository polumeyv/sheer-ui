<script lang="ts">
	import { Popover } from "../../src/lib/components/popover/index.js";

	let {
		open = false,
		closeDelay = 300,
		openDelay = 0,
		openOnHover = true,
	}: {
		open?: boolean;
		closeDelay?: number;
		openDelay?: number;
		openOnHover?: boolean;
	} = $props();

	export function setCloseDelay(next: number | undefined) {
		closeDelay = next;
	}
</script>

<Popover.Root {open}>
	{#snippet children(popover)}
		<output data-testid="open">{popover.open ? "open" : "closed"}</output>
		<Popover.Trigger {openOnHover} {openDelay} {closeDelay} data-testid="trigger">
			Trigger
		</Popover.Trigger>
		<Popover.Content forceMount preventScroll={false} trapFocus={false} data-testid="content">
			Content
		</Popover.Content>
	{/snippet}
</Popover.Root>

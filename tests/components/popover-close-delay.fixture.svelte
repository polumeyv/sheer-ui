<script lang="ts">
	import { Popover } from "../../src/lib/components/popover/index.js";

	let {
		open = $bindable(false),
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

<output data-testid="open">{open ? "open" : "closed"}</output>

<Popover.Root bind:open>
	<Popover.Trigger {openOnHover} {openDelay} {closeDelay} data-testid="trigger">
		Trigger
	</Popover.Trigger>
	<Popover.Content forceMount preventScroll={false} trapFocus={false} data-testid="content">
		Content
	</Popover.Content>
</Popover.Root>

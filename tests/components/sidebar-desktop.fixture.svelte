<script lang="ts">
	import * as Sidebar from "../../src/lib/components/sidebar/index.js";

	let {
		open = true,
		twoRoots = false,
	}: {
		open?: boolean;
		/** A second, right-hand Root in the same Provider. */
		twoRoots?: boolean;
	} = $props();
</script>

<Sidebar.Provider {open}>
	{#snippet children(sidebar)}
	<output data-testid="open">{String(sidebar.open)}</output>
	<Sidebar.Root data-testid="root-left">
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton data-testid="button-left">Dashboard</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Inset>
		<Sidebar.Trigger data-testid="trigger" />
	</Sidebar.Inset>
	{#if twoRoots}
		<Sidebar.Root side="right" data-testid="root-right">
			<Sidebar.Content>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton data-testid="button-right">Right</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Content>
		</Sidebar.Root>
	{/if}
	{/snippet}
</Sidebar.Provider>

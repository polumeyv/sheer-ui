<script lang="ts">
	import * as Sidebar from "../../src/lib/components/sidebar/index.js";

	let {
		open = true,
	}: {
		open?: boolean;
	} = $props();
</script>

<Sidebar.Provider {open}>
	{#snippet children(sidebar)}
	<output data-testid="open">{String(sidebar.open)}</output>
	<Sidebar.Root>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>Dashboard</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Inset>
		<Sidebar.Trigger data-testid="trigger" />
	</Sidebar.Inset>
	{/snippet}
</Sidebar.Provider>

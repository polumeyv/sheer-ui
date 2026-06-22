<script lang="ts">
	import * as Sidebar from "../../src/lib/components/sidebar/index.js";

	let {
		open = $bindable(true),
	}: {
		open?: boolean;
	} = $props();
</script>

<output data-testid="open">{String(open)}</output>

<Sidebar.Provider bind:open>
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
</Sidebar.Provider>

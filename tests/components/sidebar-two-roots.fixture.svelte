<script lang="ts">
	import * as Sidebar from "../../src/lib/components/sidebar/index.js";
</script>

<Sidebar.Provider>
	<Sidebar.Root side="left" data-testid="root-left">
		<Sidebar.Content>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton data-testid="button-left">Left</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Inset>
		<Sidebar.Trigger data-testid="trigger" />
	</Sidebar.Inset>
	<Sidebar.Root side="right" data-testid="root-right">
		<Sidebar.Content>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton data-testid="button-right">Right</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>

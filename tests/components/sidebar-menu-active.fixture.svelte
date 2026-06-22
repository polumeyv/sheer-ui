<script lang="ts">
	import * as Sidebar from "../../src/lib/components/sidebar/index.js";

	let active = $state("accordion");

	export function setActive(next: string) {
		active = next;
	}
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="none">
		<Sidebar.Content>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={active === "accordion"} data-testid="accordion">
						{#snippet child({ props })}
							<a href="/components/accordion" {...props}>Accordion</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={active === "card"} data-testid="card">
						{#snippet child({ props })}
							<a href="/components/card" {...props}>Card</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>

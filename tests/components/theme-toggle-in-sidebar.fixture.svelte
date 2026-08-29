<script lang="ts">
	import * as Sidebar from '../../src/lib/components/sidebar/index.js';
	import { initTheme, ThemeToggle } from '../../src/lib/components/theme-toggle/index.js';

	let { dark = false }: { dark?: boolean } = $props();

	const theme = initTheme();
	$effect(() => {
		theme.pref = dark ? 'dark' : 'light';
	});
</script>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Footer>
			<div data-testid="inside"><ThemeToggle /></div>
		</Sidebar.Footer>
	</Sidebar.Root>
	<Sidebar.Inset>
		<div data-testid="outside"><ThemeToggle /></div>
	</Sidebar.Inset>
</Sidebar.Provider>

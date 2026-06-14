<script lang="ts">
	import * as Heading from '$lib/components/heading/index';
	import { Button } from '$lib/components/button/index';
	import Settings from '@lucide/svelte/icons/settings';
	import Users from '@lucide/svelte/icons/users';

	const tabs = [
		{ id: 'overview', label: 'Overview', icon: Users },
		{ id: 'settings', label: 'Settings', icon: Settings },
	] as const;

	const activeTab = 'overview';
</script>

<div class="w-full max-w-md">
	<Heading.Root>
		<Heading.Title>
			Catalog
			<Button size="sm">New item</Button>
		</Heading.Title>
		<Heading.Nav {tabs} {activeTab} />
	</Heading.Root>
</div>

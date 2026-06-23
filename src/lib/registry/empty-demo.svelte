<script lang="ts">
	import * as Empty from '$lib/components/empty/index.js';
	import { Button } from '$lib/components/button/index.js';
	import FolderIcon from '@lucide/svelte/icons/folder';
</script>

<Empty.Root class="max-w-md border">
	<Empty.Header>
		<Empty.Media variant="icon">
			<FolderIcon />
		</Empty.Media>
		<Empty.Title>No projects yet</Empty.Title>
		<Empty.Description>Create your first project to get started.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button>Create project</Button>
	</Empty.Content>
</Empty.Root>

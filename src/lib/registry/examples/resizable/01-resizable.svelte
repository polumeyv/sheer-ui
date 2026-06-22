<script lang="ts">
	import * as Resizable from '$lib/components/resizable/index.js';
	import { Pane } from 'paneforge';
</script>

<Resizable.PaneGroup direction="horizontal" class="h-48 max-w-md rounded-lg border">
	<Pane defaultSize={50}>
		<div class="flex h-full items-center justify-center p-6">
			<span class="font-semibold">One</span>
		</div>
	</Pane>
	<Resizable.Handle withHandle />
	<Pane defaultSize={50}>
		<div class="flex h-full items-center justify-center p-6">
			<span class="font-semibold">Two</span>
		</div>
	</Pane>
</Resizable.PaneGroup>

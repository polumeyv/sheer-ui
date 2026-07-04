<script lang="ts">
	import * as Resizable from '../../lib/components/resizable/index.js';
</script>

<Resizable.PaneGroup direction="horizontal" class="h-48 max-w-md rounded-lg border">
	<Resizable.Pane defaultSize={50}>
		<div class="grid h-full place-items-center p-6">
			<span class="font-semibold">One</span>
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={50}>
		<div class="grid h-full place-items-center p-6">
			<span class="font-semibold">Two</span>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

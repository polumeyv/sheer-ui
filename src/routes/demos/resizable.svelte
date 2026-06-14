<script lang="ts">
	import * as Resizable from '$lib/components/resizable/index';
	import { Pane } from 'paneforge';
</script>

<Resizable.PaneGroup direction="horizontal" class="max-w-md rounded-lg border md:min-w-[450px]">
	<Pane defaultSize={50}>
		<div class="flex h-[200px] items-center justify-center p-6">
			<span class="font-semibold">One</span>
		</div>
	</Pane>
	<Resizable.Handle withHandle />
	<Pane defaultSize={50}>
		<Resizable.PaneGroup direction="vertical">
			<Pane defaultSize={25}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Two</span>
				</div>
			</Pane>
			<Resizable.Handle withHandle />
			<Pane defaultSize={75}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Three</span>
				</div>
			</Pane>
		</Resizable.PaneGroup>
	</Pane>
</Resizable.PaneGroup>

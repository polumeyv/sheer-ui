<script lang="ts">
	import * as Resizable from '$lib/components/resizable/index';
	import { Pane } from 'paneforge';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const GROUP = 'rounded-lg border';
	const CELL = 'flex h-full items-center justify-center p-6';
	const LABEL = 'font-semibold';
	const MUTED = 'text-muted-foreground text-sm';

	// 4 — collapsible sidebar
	let collapsed = $state(false);
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — horizontal + nested vertical (default) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A horizontal group with a nested vertical group on the right.
			</p>
		</div>
		<Resizable.PaneGroup direction="horizontal" class="{GROUP} max-w-md md:min-w-[450px]">
			<Pane defaultSize={50}>
				<div class="{CELL} h-[200px]">
					<span class={LABEL}>One</span>
				</div>
			</Pane>
			<Resizable.Handle withHandle />
			<Pane defaultSize={50}>
				<Resizable.PaneGroup direction="vertical">
					<Pane defaultSize={25}>
						<div class={CELL}>
							<span class={LABEL}>Two</span>
						</div>
					</Pane>
					<Resizable.Handle withHandle />
					<Pane defaultSize={75}>
						<div class={CELL}>
							<span class={LABEL}>Three</span>
						</div>
					</Pane>
				</Resizable.PaneGroup>
			</Pane>
		</Resizable.PaneGroup>
	</section>

	<!-- 2 — vertical -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Stack panes top-to-bottom with <code>direction="vertical"</code>.
			</p>
		</div>
		<Resizable.PaneGroup direction="vertical" class="{GROUP} h-[300px] max-w-md">
			<Pane defaultSize={25}>
				<div class={CELL}>
					<span class={LABEL}>Header</span>
				</div>
			</Pane>
			<Resizable.Handle />
			<Pane defaultSize={75}>
				<div class={CELL}>
					<span class={LABEL}>Content</span>
				</div>
			</Pane>
		</Resizable.PaneGroup>
	</section>

	<!-- 3 — min / max sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Min &amp; max sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Constrain each pane with <code>minSize</code> and <code>maxSize</code>.
			</p>
		</div>
		<Resizable.PaneGroup direction="horizontal" class="{GROUP} h-[200px] max-w-md">
			<Pane defaultSize={30} minSize={20} maxSize={40}>
				<div class={CELL}>
					<div class="text-center">
						<span class={LABEL}>Sidebar</span>
						<p class={MUTED}>20–40%</p>
					</div>
				</div>
			</Pane>
			<Resizable.Handle withHandle />
			<Pane defaultSize={70}>
				<div class={CELL}>
					<span class={LABEL}>Main</span>
				</div>
			</Pane>
		</Resizable.PaneGroup>
	</section>

	<!-- 4 — collapsible -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Collapsible</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Drag the left pane below <code>minSize</code> to collapse it to <code>collapsedSize</code>.
			</p>
		</div>
		<Resizable.PaneGroup direction="horizontal" class="{GROUP} h-[200px] max-w-md">
			<Pane
				collapsible
				collapsedSize={0}
				defaultSize={25}
				minSize={15}
				onCollapse={() => (collapsed = true)}
				onExpand={() => (collapsed = false)}
			>
				<div class={CELL}>
					<span class={LABEL}>Panel</span>
				</div>
			</Pane>
			<Resizable.Handle withHandle />
			<Pane defaultSize={75}>
				<div class={CELL}>
					<span class={MUTED}>
						{collapsed ? 'Left pane collapsed' : 'Drag the handle left'}
					</span>
				</div>
			</Pane>
		</Resizable.PaneGroup>
	</section>

	<!-- 5 — disabled handle -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A locked layout with <code>disabled</code> on the handle.
			</p>
		</div>
		<Resizable.PaneGroup direction="horizontal" class="{GROUP} h-[200px] max-w-md">
			<Pane defaultSize={50}>
				<div class={CELL}>
					<span class={LABEL}>Left</span>
				</div>
			</Pane>
			<Resizable.Handle disabled />
			<Pane defaultSize={50}>
				<div class={CELL}>
					<span class={LABEL}>Right</span>
				</div>
			</Pane>
		</Resizable.PaneGroup>
	</section>
</div>

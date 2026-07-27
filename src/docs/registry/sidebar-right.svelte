<script lang="ts" module>
	export const title = 'Right sidebar';
</script>

<script lang="ts">
	import * as Sidebar from '../../lib/components/sidebar/index.js';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';
	import PaperclipIcon from '@lucide/svelte/icons/paperclip';
	import UserIcon from '@lucide/svelte/icons/user';


	const details = [
		{ title: 'Assignee', value: 'Maya Chen', icon: UserIcon },
		{ title: 'Due date', value: 'Jul 18', icon: ClockIcon },
		{ title: 'Comments', value: '12', icon: MessageSquareIcon },
		{ title: 'Files', value: '4', icon: PaperclipIcon },
	];
</script>

<div class="relative isolate h-[28rem] w-full overflow-hidden rounded-lg border bg-background transform-gpu">
	<Sidebar.Provider open class="relative min-h-0! h-full overflow-hidden" style="--sidebar-width: 14rem;">
		{#snippet children(sidebar)}
		<Sidebar.Inset class="min-h-0 overflow-hidden">
			<header class="flex h-12 items-center gap-2 border-b px-4">
				<Sidebar.Trigger />
				<span class="truncate text-sm font-medium">Project Brief</span>
				<span class="ml-auto hidden text-xs text-muted-foreground sm:inline">
					{sidebar.open ? 'Inspector open' : 'Inspector closed'}
				</span>
			</header>
			<div class="grid flex-1 content-start gap-3 overflow-auto p-4">
				<div class="rounded-md border p-4">
					<div class="text-sm font-medium">Launch checklist</div>
					<div class="mt-2 h-3 w-full rounded bg-muted"></div>
					<div class="mt-3 h-3 w-4/5 rounded bg-muted"></div>
					<div class="mt-3 h-3 w-2/3 rounded bg-muted"></div>
				</div>
				<div class="grid gap-2">
					<div class="h-10 rounded-md border bg-muted/30"></div>
					<div class="h-10 rounded-md border bg-muted/30"></div>
					<div class="h-10 rounded-md border bg-muted/30"></div>
				</div>
			</div>
		</Sidebar.Inset>
		<Sidebar.Root side="right" collapsible="offcanvas" class="absolute! h-full!">
			<Sidebar.Header>
				<div class="px-2 py-1.5">
					<div class="text-sm font-semibold">Inspector</div>
					<div class="text-xs text-muted-foreground">Task metadata</div>
				</div>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Details</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each details as detail (detail.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton tooltipContent={detail.title}>
										<detail.icon />
										<span>{detail.title}</span>
										<span class="ml-auto text-xs text-muted-foreground">{detail.value}</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Rail />
		</Sidebar.Root>
	{/snippet}
	</Sidebar.Provider>
</div>

<script lang="ts">
	import * as Breadcrumb from '$lib/components/breadcrumb/index';
	import * as DropdownMenu from '$lib/components/dropdown-menu/index';
	import SlashIcon from '@lucide/svelte/icons/slash';
	import HouseIcon from '@lucide/svelte/icons/house';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const TRIGGER = 'flex items-center gap-1 hover:text-foreground transition-colors outline-none';
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Links, a collapsed ellipsis, and the current page.
			</p>
		</div>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Ellipsis />
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/catalog">Services</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Haircut</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>

	<!-- 2 — custom separator -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Custom separator</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Pass children to Separator to swap the default chevron.
			</p>
		</div>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator>
					<SlashIcon />
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator>
					<SlashIcon />
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Components</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>

	<!-- 3 — with icon -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icon</h3>
			<p class="text-muted-foreground mt-1 text-xs">A leading icon inside a link item.</p>
		</div>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/" class="flex items-center gap-1.5">
						<HouseIcon class="size-3.5" />
						Home
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Profile</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>

	<!-- 4 — dropdown -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Dropdown</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A breadcrumb item that opens a menu of sibling routes.
			</p>
		</div>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class={TRIGGER} aria-label="Toggle menu">
							Components
							<ChevronDownIcon class="size-4" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start">
							<DropdownMenu.Item>Documentation</DropdownMenu.Item>
							<DropdownMenu.Item>Themes</DropdownMenu.Item>
							<DropdownMenu.Item>GitHub</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>

	<!-- 5 — collapsed with dropdown ellipsis -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Collapsed</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Hide middle items behind an ellipsis trigger.
			</p>
		</div>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							class="flex items-center gap-1 outline-none"
							aria-label="Toggle hidden links"
						>
							<Breadcrumb.Ellipsis />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start">
							<DropdownMenu.Item>Catalog</DropdownMenu.Item>
							<DropdownMenu.Item>Staff</DropdownMenu.Item>
							<DropdownMenu.Item>Locations</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/bookings">Bookings</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Confirmation</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>

	<!-- 6 — long path -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Long path</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A full trail wraps onto multiple lines when narrow.
			</p>
		</div>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/catalog">Services</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/catalog/hair">Hair</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/catalog/hair/cuts">Cuts</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Fade</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>
</div>

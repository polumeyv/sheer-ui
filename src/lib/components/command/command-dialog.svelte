<script lang="ts">
	import type { DialogRootProps, DialogPortalProps } from "../../components/dialog/types.js";
	import type { CommandRootProps } from "../../components/command/types.js";
	import type { Snippet } from "svelte";
	import Command from "../../components/command/components/command.svelte";
	import * as Dialog from "../dialog/index.js";
	import type { WithoutChildrenOrChild } from "../../utils.js";

	let {
		open = false,
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command Palette",
		description = "Search for a command to run",
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<DialogRootProps> &
		WithoutChildrenOrChild<CommandRootProps> & {
			portalProps?: DialogPortalProps;
			children: Snippet;
			title?: string;
			description?: string;
		} = $props();
</script>

<Dialog.Root {open} {...restProps}>
	<Dialog.Portal {...portalProps}>
		<Dialog.Overlay />
		<Dialog.Content class="overflow-hidden p-0!">
			<div class="sr-only">
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Description>{description}</Dialog.Description>
			</div>
			<Command
				class="**:data-[slot=command-input-wrapper]:h-12 [&_[data-command-group]]:px-2 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
				{...restProps}
				bind:value
				bind:ref
				{children} />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

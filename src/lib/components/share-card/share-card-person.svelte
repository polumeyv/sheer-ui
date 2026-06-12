<script lang="ts">
import { cn, type WithElementRef } from '../../utils';
import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import * as Avatar from '../avatar';
import User from '@lucide/svelte/icons/user';

let {
	ref = $bindable(null),
	class: className,
	name,
	email,
	avatar,
	description,
	actions,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	name: string;
	email?: string;
	avatar?: string;
	description?: Snippet;
	actions?: Snippet;
} = $props();

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}
</script>

<div
	bind:this={ref}
	data-slot="share-card-person"
	class={cn('flex items-center gap-3 py-2', className)}
	{...restProps}
>
	<Avatar.Root class="size-9!">
		{#if avatar}
			<Avatar.Image src={avatar} alt={name} />
		{/if}
		<Avatar.Fallback>
			{#if avatar}
				{getInitials(name)}
			{:else}
				<User class="size-4" />
			{/if}
		</Avatar.Fallback>
	</Avatar.Root>
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium leading-none truncate">{name}</p>
		{#if description}
			<div class="text-muted-foreground text-xs truncate">
				{@render description()}
			</div>
		{:else if email}
			<p class="text-muted-foreground text-xs truncate">{email}</p>
		{/if}
	</div>
	{#if actions}
		<div class="shrink-0">
			{@render actions()}
		</div>
	{/if}
</div>

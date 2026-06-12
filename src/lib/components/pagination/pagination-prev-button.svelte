<script lang="ts">
import { Pagination as PaginationPrimitive } from 'bits-ui';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import { buttonVariants } from '../button';
import { cn } from '../../utils';

let { ref = $bindable(null), class: className, children, ...restProps }: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class="size-4" />
	<span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	aria-label="Go to previous page"
	class={cn(
		buttonVariants({
			size: "default",
			variant: "ghost",
			class: "gap-1! sm:ps-2.5",
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>

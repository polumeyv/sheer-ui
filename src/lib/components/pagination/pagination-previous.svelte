<script lang="ts">
import { Pagination as PaginationPrimitive } from 'bits-ui';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import { buttonVariants } from '../button';
import { cn } from '../../utils';

let { ref = $bindable(null), class: className, ...restProps }: PaginationPrimitive.PrevButtonProps = $props();
</script>

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
	{...restProps}
>
	<ChevronLeftIcon />
	<span class="hidden sm:block">Previous</span></PaginationPrimitive.PrevButton
>

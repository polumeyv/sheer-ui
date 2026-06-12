<script lang="ts">
import { Pagination as PaginationPrimitive } from 'bits-ui';
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
import { buttonVariants } from '../button';
import { cn } from '../../utils';

let { ref = $bindable(null), class: className, ...restProps }: PaginationPrimitive.NextButtonProps = $props();
</script>

<PaginationPrimitive.NextButton
	bind:ref
	aria-label="Go to next page"
	class={cn(
		buttonVariants({
			size: "default",
			variant: "ghost",
			class: "gap-1! sm:pe-2.5",
		}),
		className
	)}
	{...restProps}
>
	<span class="hidden sm:block">Next</span>
	<ChevronRightIcon /></PaginationPrimitive.NextButton
>

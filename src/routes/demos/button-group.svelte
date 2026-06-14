<script lang="ts">
	import * as ButtonGroup from '$lib/components/button-group/index';
	import { Button } from '$lib/components/button/index';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
</script>

<div class="flex flex-col items-center gap-6">
	<ButtonGroup.Root>
		<Button variant="outline" size="icon" aria-label="Bold">
			<Bold />
		</Button>
		<Button variant="outline" size="icon" aria-label="Italic">
			<Italic />
		</Button>
		<Button variant="outline" size="icon" aria-label="Underline">
			<Underline />
		</Button>
	</ButtonGroup.Root>

	<ButtonGroup.Root>
		<Button variant="outline" size="icon" aria-label="Previous">
			<ChevronLeft />
		</Button>
		<ButtonGroup.Separator />
		<ButtonGroup.Text>Page 1 of 8</ButtonGroup.Text>
		<ButtonGroup.Separator />
		<Button variant="outline" size="icon" aria-label="Next">
			<ChevronRight />
		</Button>
	</ButtonGroup.Root>
</div>

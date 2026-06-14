<script lang="ts">
	import * as Kbd from '$lib/components/kbd/index';
</script>

<div class="flex flex-col items-center gap-4">
	<Kbd.Group>
		<Kbd.Root>Ctrl</Kbd.Root>
		<Kbd.Root>Shift</Kbd.Root>
		<Kbd.Root>P</Kbd.Root>
	</Kbd.Group>

	<p class="text-muted-foreground text-sm">
		Press <Kbd.Root>Esc</Kbd.Root> to close the command palette.
	</p>
</div>

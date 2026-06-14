<script lang="ts">
	import * as Avatar from '$lib/components/avatar/index';
</script>

<div class="flex items-center gap-4">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
		<Avatar.Fallback>SV</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root>
		<Avatar.Fallback>NP</Avatar.Fallback>
	</Avatar.Root>
</div>

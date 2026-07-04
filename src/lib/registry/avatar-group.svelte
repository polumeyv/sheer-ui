<script lang="ts" module>
	export const title = 'Group';
</script>

<script lang="ts">
	import * as Avatar from '../components/avatar/index.js';
</script>

<div class="flex -space-x-2">
	<Avatar.Root class="ring-2 ring-background">
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root class="ring-2 ring-background">
		<Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
		<Avatar.Fallback>LR</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root class="ring-2 ring-background">
		<Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
		<Avatar.Fallback>ER</Avatar.Fallback>
	</Avatar.Root>
</div>

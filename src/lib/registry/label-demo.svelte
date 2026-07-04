<script lang="ts">
	import { Label } from '../components/label/index.js';
	import { Input } from '../components/input/index.js';
</script>

<div class="flex w-80 flex-col gap-2">
	<Label.Root for="email">Email</Label.Root>
	<Input id="email" type="email" placeholder="m@example.com" />
</div>

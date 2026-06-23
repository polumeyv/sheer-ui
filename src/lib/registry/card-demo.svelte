<script lang="ts">
	import * as Card from "$lib/components/card/index.js";
	import { Button } from "$lib/components/button/index.js";
	import { Input } from "$lib/components/input/index.js";
	import { Label } from "$lib/components/label/index.js";
</script>

<Card.Root class="w-96">
	<Card.Header>
		<Card.Title>Create project</Card.Title>
		<Card.Description>Deploy your new project in one click.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-2">
			<Label.Root for="project-name">Name</Label.Root>
			<Input id="project-name" placeholder="Name of your project" />
		</div>
	</Card.Content>
	<Card.Footer class="justify-between">
		<Button variant="outline">Cancel</Button>
		<Button>Deploy</Button>
	</Card.Footer>
</Card.Root>

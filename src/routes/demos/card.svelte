<script lang="ts">
	import * as Card from '$lib/components/card/index';
	import { Button } from '$lib/components/button/index';
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
</script>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title>Create project</Card.Title>
		<Card.Description>Deploy your new project in one click.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-2">
			<Label for="project-name">Name</Label>
			<Input id="project-name" placeholder="Name of your project" />
		</div>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Cancel</Button>
		<Button>Deploy</Button>
	</Card.Footer>
</Card.Root>

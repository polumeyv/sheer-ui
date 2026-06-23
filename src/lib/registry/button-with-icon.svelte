<script lang="ts" module>
	export const title = "With icon";
</script>

<script lang="ts">
	import { Button } from "$lib/components/button/index.js";
	import Mail from "@lucide/svelte/icons/mail";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
</script>

<div class="flex flex-wrap items-center gap-3">
	<Button>
		<Mail />
		Login with Email
	</Button>
	<Button variant="outline" disabled>
		<LoaderCircle class="animate-spin" />
		Please wait
	</Button>
</div>

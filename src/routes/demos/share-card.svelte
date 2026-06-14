<script lang="ts">
	import * as ShareCard from '$lib/components/share-card/index';
</script>

<ShareCard.Root
	title="Share this document"
	description="Anyone with the link can view."
	class="w-full max-w-sm"
>
	<ShareCard.Link value="https://acme.dev/d/9fK2p" />
	<ShareCard.People label="People with access">
		<ShareCard.Person name="Ada Lovelace" email="ada@acme.dev" />
		<ShareCard.Person name="Grace Hopper" email="grace@acme.dev" />
	</ShareCard.People>
</ShareCard.Root>

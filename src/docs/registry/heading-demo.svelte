<script lang="ts">
	// Showcase for the heading block: title-only, and title + href-driven tab nav.
	import Heading from '#lib/blocks/Heading.svelte';

	const tabs = [
		{ id: 'services', label: 'Services', href: '#services' },
		{ id: 'products', label: 'Products', href: '#products' },
	] as const;
</script>

<div class="flex w-full flex-col gap-10">
	<Heading title="Get in Touch" />
	<section id="services">
		<Heading title="Catalog" {tabs} activeTab="services" />
	</section>
	<section id="products" class="text-sm text-muted-foreground">Products section anchor</section>
</div>

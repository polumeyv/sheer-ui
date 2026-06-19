<script lang="ts">
	import * as Avatar from "$lib/components/avatar";

	// Display avatar: an optional image (e.g. an S3 object keyed by the user) with initials as the fallback when no `src`
	// is given or it 404s. The image URL is resolved by the consuming app — it depends on app env (bucket/region), so this
	// block stays env-agnostic and takes the finished `src`; apps without avatar images just omit it and get initials.
	// `cacheBust` re-fetches the image after an upload; bump it from the editing surface.
	let {
		name,
		src,
		class: className,
		fallbackClass,
		cacheBust = 0,
	}: {
		name: { f_name?: string | null; l_name?: string | null };
		src?: string;
		class?: string;
		fallbackClass?: string;
		cacheBust?: number;
	} = $props();

	const initials = $derived(
		[name.f_name, name.l_name]
			.map((n) => n?.[0] ?? '')
			.join('')
			.toUpperCase(),
	);
</script>

<Avatar.Root class={className}>
	{#if src}
		<Avatar.Image src={`${src}?v=${cacheBust}`} alt={name.f_name ?? ''} />
	{/if}
	<Avatar.Fallback class={fallbackClass}>{initials}</Avatar.Fallback>
</Avatar.Root>

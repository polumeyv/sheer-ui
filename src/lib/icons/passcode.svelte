<script lang="ts">
	let { class: className, ...rest }: import('svelte/elements').SVGAttributes<SVGSVGElement> = $props();
</script>

<svg viewBox="0 0 48 48" class={className} {...rest}>
	<title>Passcode</title>
	<g fill="currentColor">
		<circle cx="4.5" cy="4.5" r="1.5" /><circle cx="12" cy="4.5" r="1.5" /><circle cx="19.5" cy="4.5" r="1.5" />
		<circle cx="4.5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19.5" cy="12" r="1.5" />
		<circle cx="12" cy="19.5" r="1.5" />
	</g>
</svg>

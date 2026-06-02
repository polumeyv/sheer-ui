<script lang="ts">
	let { class: className, ...rest }: import('svelte/elements').SVGAttributes<SVGSVGElement> = $props();
</script>

<svg viewBox="0 0 24 24" class="smtp-logo {className}" style="overflow: visible;" {...rest}>
	<defs><path id="tri" d="M2 5h20L12 11z" /></defs>
	<path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" fill="currentColor" opacity="0.6" />
	<use href="#tri" fill="currentColor" opacity="0.3" />
	<use href="#tri" fill="currentColor" class="smtp-flap" />
</svg>

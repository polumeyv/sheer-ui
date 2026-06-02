<script lang="ts">
	let { class: className, ...rest }: import('svelte/elements').SVGAttributes<SVGSVGElement> = $props();
</script>

<svg viewBox="0 0 32 32" class={className} {...rest}>
	<path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0Z" fill="#3B82F6" />
	<path
		d="M24 11.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 8 20.5v-9a1.5 1.5 0 0 1 1.5-1.5h13a1.5 1.5 0 0 1 1.5 1.5Zm-1.5.81-6.5 4.19-6.5-4.19v-.81h13v.81Zm0 8.19v-6.69l-6.5 4.19-6.5-4.19v6.69h13Z"
		fill="white" />
</svg>

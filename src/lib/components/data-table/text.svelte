<script lang="ts" module>
	export { text };
</script>

{#snippet text({ value, class: className = '' }: { value: string; class?: string })}
	<span class={className}>{value}</span>
{/snippet}

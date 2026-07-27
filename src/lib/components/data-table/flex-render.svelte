<script
	lang="ts"
	generics="TData, TValue, TContext extends HeaderContext<TData, TValue> | CellContext<TData, TValue>"
>
	import type { CellContext, ColumnDefTemplate, HeaderContext } from "../../internal/table/types.js";
	import { RenderComponentConfig, RenderSnippetConfig } from "./render-helpers";
	import type { Attachment } from "svelte/attachments";
	type Props = {
		/** The cell or header field of the current cell's column definition. */
		content?: TContext extends HeaderContext<TData, TValue>
			? ColumnDefTemplate<HeaderContext<TData, TValue>>
			: TContext extends CellContext<TData, TValue>
				? ColumnDefTemplate<CellContext<TData, TValue>>
				: never;
		/** The result of the `getContext()` function of the header or cell */
		context: TContext;

		/** Used to pass attachments that can't be gotten through context */
		attach?: Attachment;
	};

	let { content, context, attach }: Props = $props();
</script>

{#if typeof content === "string"}
	{content}
{:else if content instanceof Function}
	<!-- It's unlikely that a CellContext will be passed to a Header -->
	<!-- $derived is load-bearing: a plain declaration tag evaluates once, so signals read inside
	     content() (e.g. a select-all header reading table.isAllPageRowsSelected) would go untracked. -->
	<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
	{const result = $derived(content(context as any))}
	{#if result instanceof RenderComponentConfig}
		{const { component: Component, props } = $derived(result)}
		<Component {...props} {attach} />
	{:else if result instanceof RenderSnippetConfig}
		{const { snippet, params } = $derived(result)}
		{@render snippet(params)}
	{:else}
		{result}
	{/if}
{/if}

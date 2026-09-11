<script lang="ts" module>
	import { createContext } from 'svelte';
	import type { VariantProps } from 'overrule';
	import { toggleVariants } from '../../toggle/variants.js';

	type ToggleVariants = VariantProps<typeof toggleVariants>;

	interface ToggleGroupContext extends ToggleVariants {
		spacing?: number;
	}

	export const [getToggleGroupCtx, setToggleGroupCtx] = createContext<Required<ToggleGroupContext>>();
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { repairBindable } from '../../../internal/tools/index.js';
	import { SelectionValue, emptySelection } from '../../../internal/selection.svelte.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ToggleGroupRootProps } from '../types.js';
	import { ToggleGroupRootState } from '../toggle-group.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = () => {},
		type,
		disabled = false,
		loop = true,
		orientation = 'horizontal',
		rovingFocus = true,
		child,
		children,
		size = 'default',
		spacing = 0,
		variant = 'default',
		...restProps
	}: ToggleGroupRootProps & ToggleVariants & { spacing?: number } = $props();

	// Context for toggle group items (values are stable, no reactivity needed)
	setToggleGroupCtx(untrack(() => ({ variant, size, spacing })));

	// Mode is fixed at mount: `value` keeps the shape it was declared with.
	// svelte-ignore state_referenced_locally
	const valueType = type;

	repairBindable(
		() => value,
		() => {
			if (value === undefined) value = emptySelection(valueType);
		},
	);

	const rootState = ToggleGroupRootState.create({
		get id() {
			return id;
		},
		get disabled() {
			return disabled;
		},
		get loop() {
			return loop;
		},
		get orientation() {
			return orientation;
		},
		get rovingFocus() {
			return rovingFocus;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
		selection: new SelectionValue(
			valueType,
			() => value ?? emptySelection(valueType),
			(v) => {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
			},
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'toggle-group',
				'data-variant': variant,
				'data-size': size,
				'data-spacing': spacing,
				style: `--gap: ${spacing}`,
				class:
					'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
			},
			restProps,
			rootState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

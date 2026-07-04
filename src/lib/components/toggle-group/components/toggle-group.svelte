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
	import { type WritableBox, boxWith } from '../../../internal/tools/index.js';
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

	// Mode is construction-static: ToggleGroupRootState chooses a single/multiple class once.
	const valueType = untrack(() => type);

	function getDefaultValue(): string | string[] {
		return valueType === 'single' ? '' : [];
	}

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = getDefaultValue();
	}

	function getValue() {
		return value ?? getDefaultValue();
	}

	// SSR
	handleDefaultValue();

	const rootState = ToggleGroupRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => getValue(),
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			},
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: boxWith(() => disabled),
		loop: boxWith(() => loop),
		orientation: boxWith(() => orientation),
		rovingFocus: boxWith(() => rovingFocus),
		type: valueType,
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
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

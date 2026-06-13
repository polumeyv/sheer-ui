<script lang="ts" module>
	import { getContext, setContext } from 'svelte';
	import type { VariantProps } from '../../utils.js';
	import { toggleVariants } from '../toggle';

	type ToggleVariants = VariantProps<typeof toggleVariants>;

	interface ToggleGroupContext extends ToggleVariants {
		spacing?: number;
	}

	export function setToggleGroupCtx(props: ToggleGroupContext) {
		setContext('toggleGroup', props);
	}

	export function getToggleGroupCtx() {
		return getContext<Required<ToggleGroupContext>>('toggleGroup');
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { type WritableBox, boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { ToggleGroupRootProps } from '$lib/components/toggle-group/primitive/types.js';
	import { ToggleGroupRootState } from '$lib/components/toggle-group/primitive/toggle-group.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import { watch } from '$lib/vendor/runed/index.js';
	import { cn } from '../../utils.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		type,
		disabled = false,
		loop = true,
		orientation = 'horizontal',
		rovingFocus = true,
		child,
		children,
		class: className,
		size = 'default',
		spacing = 0,
		variant = 'default',
		...restProps
	}: ToggleGroupRootProps & ToggleVariants & { spacing?: number } = $props();

	// Context for toggle group items (values are stable, no reactivity needed)
	setToggleGroupCtx(untrack(() => ({ variant, size, spacing })));

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === 'single' ? '' : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = ToggleGroupRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => value!,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: boxWith(() => disabled),
		loop: boxWith(() => loop),
		orientation: boxWith(() => orientation),
		rovingFocus: boxWith(() => rovingFocus),
		type,
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
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
				class: cn(
					'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
					className
				),
			},
			restProps,
			rootState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

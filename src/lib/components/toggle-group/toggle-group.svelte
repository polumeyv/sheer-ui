<script lang="ts" module>
	import { createContext } from 'svelte';
	import type { VariantProps } from 'overrule';
	import { toggleVariants } from '../toggle';

	type ToggleVariants = VariantProps<typeof toggleVariants>;

	interface ToggleGroupContext extends ToggleVariants {
		spacing?: number;
	}

	export const [getToggleGroupCtx, setToggleGroupCtx] = createContext<Required<ToggleGroupContext>>();
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { mergeProps } from '$lib/merge-props';
	import type { WritableProp } from '$lib/vendor/utils';
	import type { ToggleGroupRootProps } from '$lib/components/primitive/toggle-group/index';
	import { ToggleGroupRootState } from '$lib/components/primitive/toggle-group/toggle-group.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

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

	$effect.pre(() => {
		void value;
		untrack(() => handleDefaultValue());
	});

	const rootState = ToggleGroupRootState.create({
		id: {
			get current() {
				return id;
			},
		},
		value: {
			get current() {
				return value!;
			},
			set current(v) {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			},
		} as WritableProp<string> | WritableProp<string[]>,
		disabled: {
			get current() {
				return disabled;
			},
		},
		loop: {
			get current() {
				return loop;
			},
		},
		orientation: {
			get current() {
				return orientation;
			},
		},
		rovingFocus: {
			get current() {
				return rovingFocus;
			},
		},
		type,
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
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
					className,
				),
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

<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { SwitchRootProps } from '$lib/components/switch/primitive/types.js';
	import { SwitchRootState, SwitchThumbState } from '$lib/components/switch/primitive/switch.svelte.js';
	import SwitchInput from '$lib/components/switch/primitive/components/switch-input.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import { cn, type WithoutChildrenOrChild } from '../../utils';

	const uid = $props.id();
	const thumbId = createId(`${uid}-thumb`);

	let {
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		required = false,
		checked = $bindable(false),
		value = 'on',
		name = undefined,
		type = 'button',
		onCheckedChange = noop,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SwitchRootProps> = $props();

	let thumbRef = $state<HTMLElement | null>(null);

	const rootState = SwitchRootState.create({
		checked: boxWith(
			() => checked,
			(v) => {
				checked = v;
				onCheckedChange?.(v);
			}
		),
		disabled: boxWith(() => disabled ?? false),
		required: boxWith(() => required),
		value: boxWith(() => value),
		name: boxWith(() => name),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const thumbState = SwitchThumbState.create({
		id: boxWith(() => thumbId),
		ref: boxWith(
			() => thumbRef,
			(v) => (thumbRef = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'switch',
				class: cn(
					'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
					className
				),
			},
			restProps,
			rootState.props,
			{ type }
		)
	);

	const thumbMergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'switch-thumb',
				class: cn(
					'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
				),
			},
			thumbState.props
		)
	);
</script>

<button {...mergedProps}>
	<span {...thumbMergedProps}></span>
</button>

<SwitchInput />

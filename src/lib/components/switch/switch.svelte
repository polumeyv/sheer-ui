<script lang="ts">
	import { mergeProps } from '$lib/internal/merge-props';
	import type { SwitchRootProps } from '$lib/components/switch/primitive';
	import { SwitchRootState, SwitchThumbState } from '$lib/components/switch/primitive/switch.svelte';
	import SwitchInput from '$lib/components/switch/primitive/components/switch-input.svelte';
	import { createId } from '$lib/internal/create-id';
	import { cn, type WithoutChildrenOrChild } from '../../vendor/utils';

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
		onCheckedChange = () => {},
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SwitchRootProps> = $props();

	let thumbRef = $state<HTMLElement | null>(null);

	const rootState = SwitchRootState.create({
		checked: {
			get current() {
				return checked;
			},
			set current(v) {
				checked = v;
				onCheckedChange?.(v);
			},
		},
		disabled: {
			get current() {
				return disabled ?? false;
			},
		},
		required: {
			get current() {
				return required;
			},
		},
		value: {
			get current() {
				return value;
			},
		},
		name: {
			get current() {
				return name;
			},
		},
		id: {
			get current() {
				return id;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const thumbState = SwitchThumbState.create({
		id: {
			get current() {
				return thumbId;
			},
		},
		ref: {
			get current() {
				return thumbRef;
			},
			set current(v) {
				thumbRef = v;
			},
		},
	});
</script>

<button
	{...mergeProps(
		{
			'data-slot': 'switch',
			class: cn(
				'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
				className,
			),
		},
		restProps,
		rootState.props,
		{ type },
	)}>
	<span
		{...mergeProps(
			{
				'data-slot': 'switch-thumb',
				class: cn(
					'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
				),
			},
			thumbState.props,
		)}></span>
</button>

<SwitchInput />

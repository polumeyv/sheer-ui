export { default as Root } from '$lib/components/tabs/primitive/components/tabs.svelte';
export { default as Content } from '$lib/components/tabs/primitive/components/tabs-content.svelte';
export { default as List } from '$lib/components/tabs/primitive/components/tabs-list.svelte';
export { default as Trigger } from '$lib/components/tabs/primitive/components/tabs-trigger.svelte';

export type {
	TabsRootProps as RootProps,
	TabsContentProps as ContentProps,
	TabsTriggerProps as TriggerProps,
	TabsListProps as ListProps,
} from '$lib/components/tabs/primitive/index';

export { default as Root } from "$lib/components/pagination/primitive/components/pagination.svelte";
export { default as PrevButton } from "$lib/components/pagination/primitive/components/pagination-prev-button.svelte";
export { default as NextButton } from "$lib/components/pagination/primitive/components/pagination-next-button.svelte";
export { default as Page } from "$lib/components/pagination/primitive/components/pagination-page.svelte";

export type {
	PaginationRootProps as RootProps,
	PaginationPrevButtonProps as PrevButtonProps,
	PaginationNextButtonProps as NextButtonProps,
	PaginationPageProps as PageProps,
} from "$lib/components/pagination/primitive/index.js";

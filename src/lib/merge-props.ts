import { createMergeProps } from 'overrule/props';

export const mergeProps = createMergeProps({
	styleAs: 'string',
	dropFalseAttrs: ['hidden', 'disabled'],
	isEventHandler: (key: string) => key.length > 2 && key.startsWith('on') && key === key.toLowerCase(),
});

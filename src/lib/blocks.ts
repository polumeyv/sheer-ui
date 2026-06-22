import { blocks } from '../__registry__/blocks.js';
import * as S from 'effect/Schema';

export type BlockName = (typeof blocks)[number];

export function isBlock(name: unknown): name is BlockName {
	return blocks.includes(name as BlockName);
}

export const BlockNameSchema = S.Literals(blocks);

export const blockSchema = S.Struct({
	name: BlockNameSchema,
	description: S.String,
	container: S.optional(
		S.Struct({
			height: S.optional(S.String),
			className: S.optional(S.NullOr(S.String)),
		}),
	),
});

export type Block = typeof blockSchema.Type;

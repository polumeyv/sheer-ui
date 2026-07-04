import { Limit, type LimitType } from './Limit'

export type ScrollLimitType = {
  limit: LimitType
}

export const ScrollLimit = (
  contentSize: number,
  scrollSnaps: number[],
  loop: boolean
): ScrollLimitType => {
  const max = scrollSnaps[0]!
  const min = loop ? max - contentSize : scrollSnaps.at(-1)!
  const limit = Limit(min, max)

  const self: ScrollLimitType = {
    limit
  }
  return self
}

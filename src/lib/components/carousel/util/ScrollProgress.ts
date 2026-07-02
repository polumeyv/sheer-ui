import { type LimitType } from './Limit'
import { type NumberStoreInputType, mapStoreToNumber } from './utils'

export type ScrollProgressType = {
  get: (input: NumberStoreInputType) => number
}

export const ScrollProgress = (limit: LimitType): ScrollProgressType => {
  const { max, length } = limit

  const get = (input: number): number => {
    const currentLocation = input - max
    return length ? currentLocation / -length : 0
  }

  const self: ScrollProgressType = {
    get: mapStoreToNumber(get)
  }
  return self
}

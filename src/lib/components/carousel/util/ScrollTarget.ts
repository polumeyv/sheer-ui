import { type LimitType } from './Limit'
import { type DirectionType } from './ScrollTo'
import { type NumberStoreType } from './NumberStore'

export type TargetType = {
  distance: number
  index: number
}

export type ScrollTargetType = {
  byIndex: (target: number, direction: DirectionType) => TargetType
  byDistance: (force: number, snapToClosest: boolean) => TargetType
  shortcut: (target: number, direction: DirectionType) => number
}

export const ScrollTarget = (
  loop: boolean,
  scrollSnaps: number[],
  contentSize: number,
  limit: LimitType,
  targetVector: NumberStoreType
): ScrollTargetType => {
  const { pastAnyBound, removeOffset, clamp } = limit

  const minDistance = (distances: number[]): number =>
    distances.sort((a, b) => Math.abs(a) - Math.abs(b))[0]

  const getClosestSnap = (target: number): TargetType => {
    const distance = loop ? removeOffset(target) : clamp(target)
    const { index } = scrollSnaps.reduce(
      (result, snap, snapIndex) => {
        const displacementAbs = Math.abs(shortcut(snap - distance, 0))
        if (displacementAbs >= result.smallestDisplacement) return result
        return { smallestDisplacement: displacementAbs, index: snapIndex }
      },
      { smallestDisplacement: Infinity, index: 0 }
    )

    return { index, distance }
  }

  const shortcut = (target: number, direction: DirectionType): number => {
    if (!loop) return target

    const targets = [target, target + contentSize, target - contentSize]
    if (!direction) return minDistance(targets)

    const validTargets = targets.filter((t) => Math.sign(t) === direction)
    if (validTargets.length) return minDistance(validTargets)
    return targets.at(-1)! - contentSize
  }

  const byIndex = (index: number, direction: DirectionType): TargetType => {
    const diffToSnap = scrollSnaps[index] - targetVector.get()
    const distance = shortcut(diffToSnap, direction)
    return { index, distance }
  }

  const byDistance = (distance: number, snapToClosest: boolean): TargetType => {
    const target = targetVector.plus(distance)
    const { index, distance: targetSnapDistance } = getClosestSnap(target)
    const isPastAnyBound = !loop && pastAnyBound(target)

    if (!snapToClosest || isPastAnyBound) return { index, distance }

    const diffToSnap = scrollSnaps[index] - targetSnapDistance
    const snapDistance = distance + shortcut(diffToSnap, 0)

    return { index, distance: snapDistance }
  }

  const self: ScrollTargetType = {
    byDistance,
    byIndex,
    shortcut
  }
  return self
}

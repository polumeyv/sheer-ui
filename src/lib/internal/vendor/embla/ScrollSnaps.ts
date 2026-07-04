import { type AlignmentType } from './Alignment'
import { type AxisType } from './Axis'
import { type NodeRectType } from './NodeHandler'
import { type SlidesToScrollType } from './SlidesToScroll'

export type ScrollSnapsType = {
  snaps: number[]
  snapsAligned: number[]
}

export const ScrollSnaps = (
  axis: AxisType,
  alignment: AlignmentType,
  containerRect: NodeRectType,
  slideRects: NodeRectType[],
  slidesToScroll: SlidesToScrollType
): ScrollSnapsType => {
  const { startEdge, endEdge } = axis
  const { groupSlides } = slidesToScroll

  const measureSizes = (): number[] =>
    groupSlides(slideRects)
      .map((rects) => rects.at(-1)![endEdge] - rects[0]![startEdge])
      .map(Math.abs)

  const measureUnaligned = (): number[] =>
    slideRects
      .map((rect) => containerRect[startEdge] - rect[startEdge])
      .map((snap) => -Math.abs(snap))

  const measureAligned = (): number[] =>
    groupSlides(snaps)
      .map((g) => g[0]!)
      .map((snap, index) => snap + alignments[index]!)

  const alignments = measureSizes().map(alignment.measure)
  const snaps = measureUnaligned()
  const snapsAligned = measureAligned()

  const self: ScrollSnapsType = {
    snaps,
    snapsAligned
  }
  return self
}

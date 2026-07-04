export type PercentOfViewType = {
  measure: (input: number) => number
}

export const PercentOfView = (viewSize: number): PercentOfViewType => {
  const measure = (input: number): number => viewSize * (input / 100)

  const self: PercentOfViewType = {
    measure
  }
  return self
}

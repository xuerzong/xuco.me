export const flattenArray = <T>(arr: any[]): T[] => {
  return arr.reduce(
    (pre, cur) => [...pre, ...(Array.isArray(cur) ? flattenArray(cur) : [cur])],
    [] as T[]
  )
}

export const chunk = <T = any>(arr: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

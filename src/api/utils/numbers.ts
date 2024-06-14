export const getLowerNumber = (numbers: Array<number>): number | null => {
  if (!numbers.length) return null

  return numbers.reduce((accum, current) => accum < current ? accum : current, numbers[0])
}

export const getMaxNumber = (numbers: Array<number>): number | null => {
  if (!numbers.length) return null

  return numbers.reduce((accum, current) => accum > current ? accum : current, numbers[0])
}

export const sum = (arr: Array<string | number>): number => {
  let sum = 0

  for (let item of arr) {
    const num = typeof item === "string" ? parseInt(item) : item
    sum += num
  }

  return sum
}

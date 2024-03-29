/* eslint-disable id-length */

// Code adapted from thist Gist
// https://gist.github.com/andrei-m/982927

export const distance = (a: string, b: string) => {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []

  let i
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  let j
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b.charAt(i - 1) === a.charAt(j - 1)
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
            )
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Кривая как в CSS `cubic-bezier(x1, y1, x2, y2)`: по доле времени (0–1) дает
 * долю пути. Нужна JS-карусели, где позицию двигает requestAnimationFrame, а не
 * переход CSS.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const axis = (t: number, a: number, b: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    // Время t по кривой подбираем половинным делением: x(t) растет монотонно
    let low = 0
    let high = 1
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2
      if (axis(mid, x1, x2) < x) low = mid
      else high = mid
    }
    return axis((low + high) / 2, y1, y2)
  }
}

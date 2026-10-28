import { MainScreen } from "@/screens/main/main"

/**
 * Главная, вариант 2: та же главная, но фон по умолчанию не меняет цвет —
 * всегда синий. Вариант живет экраном, а не веткой, — решение дизайнера, см.
 * docs/architecture.md.
 */
export function MainV2Screen() {
  return <MainScreen toneChange={false} />
}

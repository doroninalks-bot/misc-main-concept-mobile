import { MainScreen } from "@/screens/main/main"

/**
 * Главная, вариант 5: соседние баннеры того же размера, что текущий. Вариант
 * живет экраном, а не веткой, — решение дизайнера, см. docs/architecture.md.
 */
export function MainV5Screen() {
  return <MainScreen slider="flat" />
}

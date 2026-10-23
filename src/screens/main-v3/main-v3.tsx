import { MainScreen } from "@/screens/main/main"

/**
 * Главная, вариант 3: баннеры лентой с наклоном. Вариант живет экраном, а не
 * веткой, — решение дизайнера, см. docs/architecture.md.
 */
export function MainV3Screen() {
  return <MainScreen slider="tilt" />
}

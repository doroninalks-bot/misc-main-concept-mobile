import { MainScreen } from "@/screens/main/main"

/**
 * Главная, вариант 4: та же карусель, но у соседних баннеров размыта только
 * иллюстрация. Вариант живет экраном, а не веткой, — решение дизайнера, см.
 * docs/architecture.md.
 */
export function MainV4Screen() {
  return <MainScreen blurArt />
}

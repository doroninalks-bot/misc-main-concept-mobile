/**
 * Экраны прототипа. Новый экран — строка здесь, папка `src/screens/<имя>/`,
 * документ `docs/screens/<имя>.md` и рамка на канвасе в `src/data/canvas.ts`.
 *
 * Порядок строк повторяет сценарий респондента. Маршрут = имя папки экрана,
 * кроме первого экрана: он живёт на `/`.
 *
 * `/kit` и `/canvas` — служебные страницы кита, они подключены в app.tsx и
 * сюда не пишутся.
 */

import type { ReactNode } from "react"

import { MainScreen } from "@/screens/main/main"

export interface ScreenRoute {
  path: string
  /** Заголовок вкладки браузера */
  title: string
  element: ReactNode
}

export const routes: ScreenRoute[] = [
  { path: "/", title: "Главная", element: <MainScreen /> },
]

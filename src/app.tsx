/**
 * Маршруты: экраны прототипа из `routes.tsx` плюс служебные `/canvas` и
 * `/kit`. Канвас — доска из дизайн-системы, грузится отдельным куском —
 * респондент ее код не скачивает.
 * `/kit` ведет на сайт дизайн-системы: компоненты живут в библиотеке
 * `@banki/design-system`, своей витрины у прототипа нет.
 */

import { Suspense, lazy, useEffect, useLayoutEffect } from "react"
import { Route, Routes, matchPath, useLocation } from "react-router"

import { routes } from "@/routes"
import { NotFoundScreen } from "@/screens/not-found/not-found"
import { CanvasReturn, syncTheme } from "@banki/design-system"

const CanvasPage = lazy(() => import("@/canvas"))

/** Сайт дизайн-системы: все компоненты с конструктором и правилами */
const DESIGN_SYSTEM_SITE = "https://banki-ds.vercel.app/kit"

function KitRedirect() {
  useEffect(() => window.location.replace(DESIGN_SYSTEM_SITE), [])
  return null
}

const SERVICE_TITLES: Record<string, string> = {
  "/kit": "Дизайн-система — прототип",
  "/canvas": "Канвас — прототип",
}

export function App() {
  const { pathname } = useLocation()

  // Новый экран открывается сверху, как отдельная страница. Смена решётки —
  // это переход внутри страницы (раздел витрины), прокрутку не трогаем
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // У платформы и прототипа темы разные, а переход между ними — без перезагрузки
  useLayoutEffect(() => {
    syncTheme()
  }, [pathname])

  useEffect(() => {
    document.title =
      routes.find((route) => route.path === pathname)?.title ?? SERVICE_TITLES[pathname] ?? "Прототип"
  }, [pathname])

  // Экран прототипа, открытый отдельно, а не в рамке канваса
  const isScreen = routes.some((route) => matchPath(route.path, pathname)) && !document.body.classList.contains("is-embed")

  return (
    <Suspense fallback={null}>
      {isScreen && <CanvasReturn />}
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="/kit" element={<KitRedirect />} />
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Suspense>
  )
}

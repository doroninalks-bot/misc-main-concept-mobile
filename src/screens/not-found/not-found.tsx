import { Button, SiteHeader } from "@banki/design-system"

import "./not-found.css"

/**
 * Адрес, которого нет в src/routes.tsx: опечатка в ссылке или экран
 * переименовали. Служебный экран кита — остаётся в каждом прототипе.
 */
export function NotFoundScreen() {
  return (
    <div className="app-shell">
      <SiteHeader href="/" />
      <main className="not-found">
        <h1 className="text-h2">Такого экрана нет</h1>
        <p className="not-found__text text-body-16">Проверьте ссылку или начните с первого экрана</p>
        <Button to="/">На первый экран</Button>
      </main>
    </div>
  )
}

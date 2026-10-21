import { Button, SiteHeader } from "@banki/design-system"

import "./index.css"

/**
 * Стартовый экран заготовки. Существует, только чтобы прототип открывался сразу
 * после старта: видно, что шрифты, токены, шапка и канвас работают. Первый же
 * экран прототипа заменяет его целиком — вместе с docs/screens/index.md.
 */
export function IndexScreen() {
  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="index">
        <section className="index__card">
          <p className="index__badge text-tag-s">prototype-starter</p>
          <h1 className="index__title text-h1">Прототип готов к работе</h1>
          <p className="index__text text-body-16">
            Это стартовый экран заготовки. Его заменит первый экран прототипа —{" "}
            <span className="index__code">src/screens/index/index.tsx</span>.
          </p>

          <div className="index__actions">
            <Button size="h48" href="/canvas" target="_blank" rel="noreferrer">
              Открыть канвас
            </Button>
            <Button size="h48" variant="tertiary" href="/kit" target="_blank" rel="noreferrer">
              Открыть дизайн-систему
            </Button>
          </div>

          <ul className="index__list text-body-14">
            <li>
              <span className="index__code">@banki/design-system</span>
              <span className="index__note">кнопки, поля, шторки — уже готовы, на сайте дизайн-системы</span>
            </li>
            <li>
              <span className="index__code">design-system/docs/content/</span>
              <span className="index__note">реальные данные витрин</span>
            </li>
            <li>
              <span className="index__code">AGENTS.md</span>
              <span className="index__note">правила работы над прототипом</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

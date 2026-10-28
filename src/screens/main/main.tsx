import { MainSearch } from "@/components/main-search/main-search"
import { ProductTiles } from "@/components/product-tiles/product-tiles"
import { productColumns } from "@/data/main"

import { Hero } from "./hero"
import { Shortcuts } from "./shortcuts"

import "./main.css"

/**
 * Главная Банки.ру, мобильный концепт: баннеры каруселью по центру, поиск,
 * быстрые ссылки и плитки «Наши продукты».
 *
 * `toneChange` — фон героя по умолчанию меняет цвет вслед за баннером:
 * вариант 1 на `/`. Вариант 2 (`/main-v2`, экран `src/screens/main-v2/`) — без него.
 */
export function MainScreen({ toneChange = true }: { toneChange?: boolean }) {
  return (
    <div className="main">
      <Hero toneChange={toneChange} />

      <main className="main__sheet">
        <div className="main__top">
          <MainSearch />
          <Shortcuts />
        </div>
        <ProductTiles columns={productColumns} />
      </main>
    </div>
  )
}

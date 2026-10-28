import { MainSearch } from "@/components/main-search/main-search"
import { ProductTiles } from "@/components/product-tiles/product-tiles"
import { productColumns } from "@/data/main"

import { Hero } from "./hero"
import { Shortcuts } from "./shortcuts"

import "./main.css"

/**
 * Главная Банки.ру, мобильный концепт: баннеры каруселью по центру, поиск,
 * быстрые ссылки и плитки «Наши продукты».
 */
export function MainScreen() {
  return (
    <div className="main">
      <Hero />

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

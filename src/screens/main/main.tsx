import { MainSearch } from "@/components/main-search/main-search"
import { ProductTiles } from "@/components/product-tiles/product-tiles"
import { productColumns } from "@/data/main"

import { Hero, type HeroSlider } from "./hero"
import { Shortcuts } from "./shortcuts"

import "./main.css"

/**
 * Главная Банки.ру, мобильный концепт: баннеры каруселью по центру, поиск,
 * быстрые ссылки и плитки «Наши продукты».
 *
 * `slider` — вид слайдера баннеров: `coverflow` на `/`, `tilt` на `/main-v3`
 * (экран `src/screens/main-v3/`). `blurArt` — у соседних баннеров размыта
 * только иллюстрация, `/main-v4`.
 */
export function MainScreen({ slider = "coverflow", blurArt = false }: { slider?: HeroSlider; blurArt?: boolean }) {
  return (
    <div className="main">
      <Hero slider={slider} blurArt={blurArt} />

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

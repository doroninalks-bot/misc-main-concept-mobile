import { ArtLayer } from "@/components/product-tiles/product-tiles"
import { shortcuts } from "@/data/main"

import "./shortcuts.css"

/**
 * Быстрые ссылки под поиском: плашка 80 с иллюстрацией и подпись в две
 * строки. Лента листается пальцем до краев экрана. Без перехода — дальше
 * экранов нет.
 */
export function Shortcuts() {
  return (
    <nav className="main-shortcuts" aria-label="Быстрые ссылки">
      {shortcuts.map((item) => (
        <a key={item.id} href="#" className="main-shortcuts__item" onClick={(event) => event.preventDefault()}>
          <span className="main-shortcuts__icon">
            {item.art.map((layer, index) => (
              <ArtLayer key={index} layer={layer} />
            ))}
          </span>
          <span className="main-shortcuts__label text-body-14">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}

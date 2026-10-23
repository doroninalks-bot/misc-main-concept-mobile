import { maskIcon } from "@banki/design-system"

import "./main-search.css"

/** Поиск главной — плашка-кнопка, сам поиск в прототипе не открывается */
export function MainSearch() {
  return (
    <button type="button" className="main-search text-body-16">
      <span className="main-search__icon" style={maskIcon("/assets/icons/navigation/search-24.svg")} />
      Продукт, сервис, услуга
    </button>
  )
}

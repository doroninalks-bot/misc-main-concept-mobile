import type { Banner } from "@/data/main"

import "./banner.css"

const IMAGES = "/assets/images/misc-main-concept-mobile/banners"

/**
 * Баннер героя 236 × 322: цветная карточка с подсветкой и иллюстрацией.
 * Цвет и раскладка слоев — в banner.css по `id`, как в макете (22713:55662).
 */
export function HeroBanner({ banner }: { banner: Banner }) {
  const { id } = banner

  return (
    <article className={`main-banner main-banner--${id}`}>
      <span className="main-banner__art" aria-hidden="true">
        <img className="main-banner__light" src={`${IMAGES}/${LIGHTS[id]}`} alt="" />
        {id === "deposit" && <img className="main-banner__light-small" src={`${IMAGES}/blue-light-small.svg`} alt="" />}
        {/* Картинки в отдельном слое — его двигает параллакс карусели */}
        <span className="main-banner__picture">
          <img className="main-banner__image" src={`${IMAGES}/${id === "account" ? "account" : "deposit"}.png`} alt="" />
          {id === "deposit-grey" && <img className="main-banner__image" src={`${IMAGES}/deposit-top.png`} alt="" />}
        </span>
      </span>
      <h2 className="main-banner__title text-h4">{banner.title}</h2>
      <p className="main-banner__text text-body-14">{banner.text}</p>
    </article>
  )
}

const LIGHTS = {
  account: "purple-light.svg",
  deposit: "blue-light.svg",
  "deposit-grey": "grey-light.svg",
}

import { cx } from "@banki/design-system"

import type { Banner } from "@/data/main"

import "./banner.css"

const IMAGES = "/assets/images/misc-main-concept-mobile/banners"

/**
 * Баннер героя: цветная карточка с подсветкой и иллюстрацией. Макет — раздел 9
 * (22797:43983 и 22797:44638): текущий 260 × 354, остальные 236 × 322.
 * У текущего другая подсветка и крупнее картинка, текст того же размера —
 * поэтому карточка меняет размер, а не масштаб. Раскладка слоев — в banner.css.
 */
export function HeroBanner({ banner, active = false }: { banner: Banner; active?: boolean }) {
  const { id } = banner

  return (
    <article className={cx("main-banner", `main-banner--${id}`, active && "main-banner--active")}>
      <span className="main-banner__art" aria-hidden="true">
        <img className="main-banner__light" src={`${IMAGES}/${LIGHTS[id]}.svg`} alt="" />
        {id !== "deposit-grey" && (
          <img className="main-banner__light-active" src={`${IMAGES}/${LIGHTS[id]}-active.svg`} alt="" />
        )}
        {id === "deposit" && <img className="main-banner__light-small" src={`${IMAGES}/blue-light-small.svg`} alt="" />}
        {/* Картинки в отдельном слое — его двигает параллакс карусели */}
        <span className="main-banner__picture">
          <img
            className="main-banner__image"
            src={`${IMAGES}/${id === "account" ? "account" : "deposit"}.png`}
            alt=""
          />
          {id === "deposit-grey" && <img className="main-banner__image" src={`${IMAGES}/deposit-top.png`} alt="" />}
        </span>
      </span>
      <div className="main-banner__content">
        <h2 className="main-banner__title text-h4">{banner.title}</h2>
        <p className="main-banner__text text-body-16">{banner.text}</p>
      </div>
    </article>
  )
}

const LIGHTS = {
  account: "purple-light",
  deposit: "blue-light",
  "deposit-grey": "grey-light",
}

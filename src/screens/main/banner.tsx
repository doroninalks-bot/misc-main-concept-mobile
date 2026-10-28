import { cx } from "@banki/design-system"

import type { Banner } from "@/data/main"

import "./banner.css"

const IMAGES = "/assets/images/misc-main-concept-mobile/banners"

/**
 * Баннер героя: карточка с градиентом и иллюстрацией. Макет — раздел 9
 * (22797:43983 и 22797:44638), градиенты — компонент «banners» (22915:22967):
 * текущий 260 × 354, остальные 236 × 322.
 * Раскладка — по текущему, остальные уменьшены масштабом: на телефоне так
 * переход плавный. Текст у всех того же размера, у текущего крупнее картинка —
 * слои в banner.css, их степень задает --t слота.
 */
export function HeroBanner({ banner }: { banner: Banner }) {
  const { id } = banner

  return (
    <article className={cx("main-banner", `main-banner--${id}`)}>
      <span className="main-banner__art" aria-hidden="true">
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

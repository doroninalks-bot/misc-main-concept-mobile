import { cx } from "@banki/design-system"

import type { Banner } from "@/data/main"

import "./banner.css"

const IMAGES = "/assets/images/misc-main-concept-mobile/banners"

/**
 * Баннер героя: карточка с градиентом и иллюстрацией. Макет — раздел 12
 * (22878:39553), компонент «banners»: текущий 260 × 354, остальные 236 × 322.
 * Раскладка — по текущему, остальные уменьшены масштабом: на телефоне так
 * переход плавный. Текст у всех того же размера — слои в banner.css.
 */
export function HeroBanner({ banner, active = false }: { banner: Banner; active?: boolean }) {
  const { id } = banner

  return (
    <article className={cx("main-banner", `main-banner--${id}`, active && "main-banner--active")}>
      {/* Иллюстрация в рамке из макета, обрезана сверху. У
          синего и серого в макете одна картинка */}
      <span className="main-banner__picture" aria-hidden="true">
        <img
          className="main-banner__image"
          src={`${IMAGES}/art-${id === "account" ? "account" : "deposit"}.png`}
          alt=""
        />
      </span>
      <div className="main-banner__content">
        <h2 className="main-banner__title text-h4">{banner.title}</h2>
        <p className="main-banner__text text-body-16">{banner.text}</p>
      </div>
    </article>
  )
}

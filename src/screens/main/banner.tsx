import { cx } from "@banki/design-system"

import type { Banner, BannerId } from "@/data/main"

import "./banner.css"

const IMAGES = "/assets/images/misc-main-concept-mobile/banners"

/**
 * Слои иллюстрации каждого баннера. Координаты — в banner.css по классу
 * слоя. `crop` — слой показывает кусок общей картинки, как кадрирование в
 * Фигме: у ОСАГО шина и колесо вырезаны из одного листа.
 */
const ART: Record<BannerId, { src: string; layer: string; crop?: boolean }[]> = {
  account: [{ src: "account.png", layer: "account" }],
  deposit: [{ src: "deposit.png", layer: "deposit" }],
  bonus: [{ src: "bonus.png", layer: "bonus" }],
  loan: [{ src: "loan.png", layer: "loan" }],
  cashback: [{ src: "cashback.png", layer: "cashback" }],
  osago: [
    { src: "osago.png", layer: "osago-shield", crop: true },
    { src: "osago.png", layer: "osago-tire", crop: true },
    { src: "osago.png", layer: "osago-wheel", crop: true },
  ],
  review: [{ src: "review.png", layer: "review" }],
}

/**
 * У этих баннеров картинка у соседних в макете того же размера, что у
 * текущего. У остальных она уменьшена вместе с карточкой
 */
const FIXED_ART: BannerId[] = ["account", "deposit"]

/**
 * Баннер героя: карточка с градиентом и иллюстрацией. Макет — компонент
 * «banners» (22874:31062): текущий 260 × 354, остальные 236 × 322 — та же
 * карточка в масштабе, картинка в ней ниже на 19,8 (кроме FIXED_ART).
 * Раскладка — по текущему, остальные уменьшены масштабом: на телефоне так
 * переход плавный. Текст у всех того же размера — слои в banner.css, их
 * степень задает --t слота.
 */
export function HeroBanner({ banner }: { banner: Banner }) {
  const { id, tone } = banner

  return (
    <article className={cx("main-banner", `main-banner--${tone}`, FIXED_ART.includes(id) && "main-banner--fixed-art")}>
      <span className="main-banner__art" aria-hidden="true">
        {/* Картинки в отдельном слое — его двигает параллакс карусели */}
        <span className="main-banner__picture">
          {ART[id].map(({ src, layer, crop }) =>
            crop ? (
              <span key={layer} className={cx("main-banner__crop", `main-banner__image--${layer}`)}>
                <img src={`${IMAGES}/${src}`} alt="" />
              </span>
            ) : (
              <img
                key={layer}
                className={cx("main-banner__image", `main-banner__image--${layer}`)}
                src={`${IMAGES}/${src}`}
                alt=""
              />
            ),
          )}
        </span>
      </span>
      <div className="main-banner__content">
        <h2 className="main-banner__title text-h4">{banner.title}</h2>
        <p className="main-banner__text text-body-16">{banner.text}</p>
      </div>
    </article>
  )
}

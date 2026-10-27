import { useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { useSearchParams } from "react-router"

import { SiteHeaderLogo, cx, maskIcon } from "@banki/design-system"

import { BANNER_START, HERO_INTERVAL_MS, banners, type BannerId } from "@/data/main"

import { HeroBanner } from "./banner"

import "./hero.css"

const HEADER_ICONS = "/assets/icons/header"

export type HeroSlider = "coverflow" | "tilt" | "flat"

/** Свайп дальше этого — смена баннера */
const SWIPE_THRESHOLD = 50

const count = banners.length
/**
 * Каждый баннер в ленте дважды: при смене крайний уходит за экран с одной
 * стороны, а его копия приезжает с другой — лента бесконечная.
 */
const slots = [...banners, ...banners].map((banner, index) => ({
  banner,
  key: `${banner.id}-${index < count ? "a" : "b"}`,
  index,
}))

/** Где слот относительно текущего: 0 — по центру, −1 и 1 — по бокам, дальше — за экраном */
function offsetOf(slot: number, position: number) {
  const total = slots.length
  const offset = (((slot - position) % total) + total) % total
  return offset > total / 2 ? offset - total : offset
}

/**
 * Герой главной: шапка на цвете и баннеры каруселью по центру. Текущий крупнее,
 * соседние меньше выглядывают по бокам. Смена — сама каждые 6 секунд (полоса в пагинации), свайпом и
 * нажатием на соседний баннер или точку: лента едет, текущий уменьшается,
 * следующий вырастает, иллюстрация едет вместе с карточкой.
 *
 * `?slide=<id баннера>` — нужный баннер по центру без смены, для рамок канваса.
 *
 * `slider="tilt"` — вариант `/main-v3` по референсу дизайнера:
 * лента с наклоном. Соседние стоят с зазором и повернуты в 3D к центру; при
 * смене лента едет, карточки на ходу разворачиваются. Разница — только в
 * hero.css (`.main-hero--tilt`).
 *
 * `slider="flat"` — вариант `/main-v5` (раздел 12, 22878:57650): соседние того
 * же размера, что текущий, при смене иллюстрация поднимается на 12 —
 * `.main-hero--flat` в hero.css.
 */
export function Hero({ slider = "coverflow" }: { slider?: HeroSlider }) {
  const [params] = useSearchParams()
  const pinned = banners.findIndex((banner) => banner.id === params.get("slide"))
  const autoplay = pinned < 0

  // Позиция в ленте слотов, не номер баннера: растет и убывает без скачков
  const [position, setPosition] = useState(pinned < 0 ? BANNER_START : pinned)
  const [dragX, setDragX] = useState(0)
  const start = useRef<number | null>(null)
  const moved = useRef(false)

  const active = ((position % count) + count) % count
  const go = (step: number) => setPosition((value) => value + step)
  // К баннеру по точке — коротким путем по кругу: с третьего на первый лента
  // едет на шаг вперед, а не на два назад — решение дизайнера
  const goTo = (index: number) => {
    const step = index - active
    go(step > count / 2 ? step - count : step < -count / 2 ? step + count : step)
  }

  const onPointerDown = (event: PointerEvent) => {
    start.current = event.clientX
    moved.current = false
  }
  const onPointerMove = (event: PointerEvent) => {
    if (start.current === null) return
    const dx = event.clientX - start.current
    // Указатель захватываем, только когда потянули: иначе нажатие на соседний
    // баннер уйдет в ленту, а не в баннер
    if (!moved.current && Math.abs(dx) > 4) {
      moved.current = true
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // Указатель уже отпущен — захватывать нечего, свайп засчитается по pointerup
      }
    }
    if (moved.current) setDragX(dx)
  }
  const onPointerUp = () => {
    if (start.current === null) return
    start.current = null
    if (Math.abs(dragX) > SWIPE_THRESHOLD) go(dragX < 0 ? 1 : -1)
    setDragX(0)
  }

  return (
    <section
      className={cx("main-hero", slider !== "coverflow" && `main-hero--${slider}`)}
      // Фон в цвет текущего баннера — hero.css по data-banner
      data-banner={banners[active].id}
      aria-label="Баннеры"
    >
      <div className="main-hero__bg" aria-hidden="true">
        <div className="main-hero__stage">
          <HeroGlow />
        </div>
      </div>

      <header className="main-hero__header">
        <SiteHeaderLogo className="main-hero__logo" />
        <div className="main-hero__actions">
          <HeaderIcon icon="user-16" label="Войти" />
          <HeaderIcon icon="search-16" label="Поиск" />
          <HeaderIcon icon="menu-16" label="Меню" />
        </div>
      </header>

      <div
        className={cx("main-hero__track", dragX !== 0 && "is-dragging")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slots.map((slot) => {
          // Слоты за экраном прозрачные: их перелет на другую сторону не виден
          const offset = offsetOf(slot.index, position)
          const style = { "--offset": offset, "--drag": `${dragX}px` } as CSSProperties

          return (
            <div
              key={slot.key}
              className={cx("main-hero__slot", offset === 0 && "is-active", Math.abs(offset) > 1 && "is-hidden")}
              style={style}
              aria-hidden={offset !== 0}
              onClick={() => Math.abs(offset) === 1 && !moved.current && go(offset)}
            >
              <HeroBanner banner={slot.banner} active={offset === 0} />
            </div>
          )
        })}
      </div>

      <div className="main-hero__pagination">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            className={cx("main-hero__dot", index === active && "is-active")}
            aria-label={`Баннер ${index + 1} из ${count}`}
            aria-current={index === active}
            onClick={() => goTo(index)}
          >
            {index === active && (
              // key с позицией: полоса бежит заново после любой смены, конец полосы — смена
              <span
                key={position}
                className={cx("main-hero__progress", !autoplay && "is-paused")}
                style={{ animationDuration: `${HERO_INTERVAL_MS}ms` }}
                onAnimationEnd={autoplay ? () => go(1) : undefined}
              />
            )}
          </button>
        ))}
        <span className="main-hero__dot main-hero__dot--more" aria-hidden="true" />
      </div>
    </section>
  )
}

/** Контур пятен фона из макета — у верхнего и нижнего один */
const BLOB =
  "M233.5 15.44C78 -26.97 0 21.64 0 116.44C0 234.94 221.5 342.94 357.5 295.94C523.5 238.57 389 57.85 233.5 15.44Z"

/** Цвета пятен у каждого баннера: большое в середине и светлое внизу */
const GLOW: Record<BannerId, { middle: string; bottom: string }> = {
  account: { middle: "#2e1563", bottom: "#9877f7" },
  deposit: { middle: "#301c9f", bottom: "#5b8ffd" },
  "deposit-grey": { middle: "#425797", bottom: "#84a1e3" },
}

/**
 * Фон героя — размытые пятна из макета (раздел 12, 22878:39553) в рамке экрана
 * 375 × 680: темное сверху общее, а среднее и нижнее — в цвет баннера, по
 * слою на каждый. Размытие макета 110, 250 и 200 — в SVG половина.
 */
function HeroGlow() {
  return (
    <>
      <svg className="main-hero__glow" width="375" height="680" viewBox="0 0 375 680" fill="none">
        <GlowFilter id="main-hero-blur-55" blur={55} />
        <path
          d={BLOB}
          fill="#17184a"
          filter="url(#main-hero-blur-55)"
          transform="matrix(0.97776 -0.20973 0.20973 0.97776 -31 -105.035)"
        />
      </svg>
      {banners.map(({ id }) => (
        <svg
          key={id}
          className={`main-hero__glow main-hero__glow--palette main-hero__glow--${id}`}
          width="375"
          height="680"
          viewBox="0 0 375 680"
          fill="none"
        >
          <GlowFilter id={`main-hero-blur-125-${id}`} blur={125} />
          <GlowFilter id={`main-hero-blur-100-${id}`} blur={100} />
          <ellipse
            cx="334.709"
            cy="231.114"
            rx="334.709"
            ry="231.114"
            fill={GLOW[id].middle}
            filter={`url(#main-hero-blur-125-${id})`}
            transform="matrix(0.96718 0.2541 -0.2541 0.96718 -154.172 149.129)"
          />
          <path
            d={BLOB}
            fill={GLOW[id].bottom}
            filter={`url(#main-hero-blur-100-${id})`}
            transform="translate(94.5 390)"
          />
        </svg>
      ))}
    </>
  )
}

/** Размытие с запасом по краям — иначе края пятна обрезаются */
function GlowFilter({ id, blur }: { id: string; blur: number }) {
  return (
    <filter id={id} x="-1000" y="-1000" width="3000" height="3000" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation={blur} />
    </filter>
  )
}

function HeaderIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <button type="button" className="main-hero__action" aria-label={label}>
      <span className="main-hero__action-icon" style={maskIcon(`${HEADER_ICONS}/${icon}.svg`)} />
    </button>
  )
}

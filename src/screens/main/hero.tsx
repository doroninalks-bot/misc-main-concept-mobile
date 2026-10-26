import { useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { useSearchParams } from "react-router"

import { Button, SiteHeaderLogo, cx, maskIcon } from "@banki/design-system"

import { BANNER_START, HERO_INTERVAL_MS, banners } from "@/data/main"

import { HeroBanner } from "./banner"

import "./hero.css"

const HEADER_ICONS = "/assets/icons/header"

export type HeroSlider = "coverflow" | "tilt"

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
 * Герой главной: шапка на цвете и баннеры каруселью по центру. Текущий крупнее
 * и непрозрачный, соседние меньше, полупрозрачные и размытые выглядывают по
 * бокам. Смена — сама каждые 6 секунд (полоса в пагинации), свайпом и
 * нажатием на соседний баннер или точку: лента едет, текущий уменьшается,
 * следующий вырастает, картинки внутри отстают — параллакс.
 *
 * `?slide=<id баннера>` — нужный баннер по центру без смены, для рамок канваса.
 *
 * `slider="tilt"` — вариант `/main-v3` по референсу дизайнера:
 * лента с наклоном. Соседние стоят с зазором и повернуты в 3D к центру; при
 * смене лента едет, карточки на ходу разворачиваются. Разница — только в
 * hero.css (`.main-hero--tilt`).
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
          <Button size="h36" variant="tertiary-inverse" className="main-hero__login">
            Войти
          </Button>
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
              <HeroBanner banner={slot.banner} />
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
            onClick={() => go(index - active)}
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
      </div>
    </section>
  )
}

/**
 * Свечение фона — три размытых пятна из макета (MobileBackground, 22797:43972).
 * SVG встроен, чтобы цвета пятен брались из hero.css по текущему баннеру и
 * плавно перетекали при смене.
 */
function HeroGlow() {
  return (
    <svg className="main-hero__glow" width="1254" height="954" viewBox="0 0 1254.25 954.403" fill="none">
      <g filter="url(#main-hero-blur-60)">
        <path
          className="main-hero__glow-base"
          d="M895.663 277.137C934.426 421.803 808.059 581.357 613.415 633.512C418.77 685.666 229.556 610.672 190.793 466.007C152.03 321.341 287.54 193.392 482.184 141.237C676.829 89.0824 856.9 132.472 895.663 277.137Z"
        />
      </g>
      <g className="main-hero__glow-accent" filter="url(#main-hero-blur-95)">
        <path d="M465.061 305.146C355.438 217.036 236.011 281.319 190 324.474L302.169 764.403C509.937 729.116 943.708 653.893 1016.64 635.297C1089.57 616.702 968.471 396.191 898.803 288.26C799.899 330.601 574.684 393.255 465.061 305.146Z" />
      </g>
      <g filter="url(#main-hero-blur-95)">
        <path
          className="main-hero__glow-bright"
          d="M684.183 332.738C798.183 343.938 829.683 328.071 831.183 318.738C978.183 220.238 1285.68 656.738 805.183 523.738C324.683 390.738 541.683 318.738 684.183 332.738Z"
        />
      </g>
      <defs>
        <filter id="main-hero-blur-60" x="0" y="0" width="1254.25" height="954.403" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="60" />
        </filter>
        <filter id="main-hero-blur-95" x="0" y="0" width="1254.25" height="954.403" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="95" />
        </filter>
      </defs>
    </svg>
  )
}

function HeaderIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <button type="button" className="main-hero__action" aria-label={label}>
      <span className="main-hero__action-icon" style={maskIcon(`${HEADER_ICONS}/${icon}.svg`)} />
    </button>
  )
}

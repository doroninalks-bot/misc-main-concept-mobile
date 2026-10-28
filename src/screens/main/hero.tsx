import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react"
import { useSearchParams } from "react-router"

import { Button, SiteHeaderLogo, cx, maskIcon } from "@banki/design-system"

import {
  CarouselTuning,
  EASINGS,
  tuningStyle,
  useCarouselTuning,
} from "@/components/carousel-tuning/carousel-tuning"
import { BANNER_START, HERO_INTERVAL_MS, banners } from "@/data/main"
import { cubicBezier } from "@/utils/cubic-bezier"

import { HeroBanner } from "./banner"

import "./hero.css"

const HEADER_ICONS = "/assets/icons/header"

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

/** Где слот относительно позиции: 0 — по центру, −1 и 1 — по бокам, дальше — за экраном. Позиция может быть дробной */
function offsetOf(slot: number, position: number) {
  const total = slots.length
  const offset = (((slot - position) % total) + total) % total
  return offset > total / 2 ? offset - total : offset
}

/** Свайп короче этого, в долях шага (~40 px), возвращает баннер на место */
const SWIPE_MIN = 0.15

/** Прозрачность ушедших слотов: невидимо глазу, но слой остается нарисованным */
const HIDDEN_FADE = 0.001

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Герой главной: шапка на цвете и баннеры каруселью по центру. Текущий крупнее,
 * соседние меньше выглядывают по бокам. Смена — сама каждые 6 секунд (полоса в пагинации), свайпом и
 * нажатием на соседний баннер или точку: лента едет, текущий уменьшается,
 * следующий вырастает, картинки внутри отстают — параллакс.
 *
 * Положение ленты — одно дробное число `pos` (какой баннер сейчас в центре, в
 * долях шага). Оно живет в ref и каждый кадр пишется прямо в стили слотов
 * (`paint`): шестьдесят setState в секунду перерисовывали бы шесть баннеров
 * ради чисел, которых React видеть не нужно. Палец двигает `pos`, отпускание
 * и смена по таймеру — плавный доезд до целой позиции (`settle`). React хранит
 * только целую цель `position` — для точек, фона и полосы.
 *
 * `?slide=<id баннера>` — нужный баннер по центру без смены, для рамок канваса.
 *
 * Свайп — как колесо выбора времени в iOS (решение дизайнера, был вариантом 5):
 * отпущенная лента едет по инерции и затухает (`glide`), сильный бросок
 * пролистывает сразу несколько баннеров, в конце лента встает на ближайший.
 */
export function Hero() {
  const [params] = useSearchParams()
  const pinned = banners.findIndex((banner) => banner.id === params.get("slide"))
  const autoplay = pinned < 0

  // Целая цель в ленте слотов, не номер баннера: растет и убывает без скачков
  const [position, setPosition] = useState(pinned < 0 ? BANNER_START : pinned)
  const [tuning, setTuning] = useCarouselTuning()
  const tuningRef = useRef(tuning)
  tuningRef.current = tuning

  const trackRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const pos = useRef(position)
  const target = useRef(position)
  const raf = useRef<number | null>(null)
  // samples — последние положения ленты за ~100 мс: скорость броска по одному последнему
  // движению пальца скачет, по короткому окну — ровная
  const drag = useRef<{ x: number; pos: number; step: number; samples: { t: number; pos: number }[] } | null>(null)
  const moved = useRef(false)

  const active = ((position % count) + count) % count

  /** Пишет в каждый слот, где он: --offset (шагов от центра), --t (1 в центре, 0 на шаг и дальше), --fade */
  const paint = () => {
    slotRefs.current.forEach((slot, index) => {
      if (!slot) return
      const offset = offsetOf(index, pos.current)
      const distance = Math.abs(offset)
      slot.style.setProperty("--offset", String(offset))
      slot.style.setProperty("--t", String(clamp01(1 - distance)))
      // Ушедший на два шага слот прозрачен к моменту, когда копия перелетает на другую сторону
      // Не ровно 0: полностью прозрачный слой браузер не рисует, и тяжелая
      // отрисовка баннера (градиент, маска, картинки) ложится на первый кадр смены — рывок
      slot.style.setProperty("--fade", String(Math.max(HIDDEN_FADE, clamp01(2 - distance))))
      slot.style.zIndex = String(100 - Math.round(distance * 10))
    })
  }

  const stop = () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    raf.current = null
  }

  /**
   * Доезд до целой позиции. «По времени» — кривая с разгоном и торможением,
   * без резкого старта; «затухание» — экспоненциальное, не зависит от частоты кадров
   */
  const settle = (to: number) => {
    stop()
    target.current = to
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const { mode, duration, easing } = tuningRef.current
    const from = pos.current
    const distance = to - from
    const points = (EASINGS.find((item) => item.id === easing) ?? EASINGS[0]).points
    const ease = cubicBezier(points[0], points[1], points[2], points[3])
    // Короткий доезд (после нажатия посреди смены) не должен тянуться как целая смена
    const total = duration * Math.min(1, Math.max(0.35, Math.abs(distance)))
    let begin = 0
    let last = performance.now()

    const step = (now: number) => {
      if (mode === "time") {
        begin ||= now
        const progress = Math.min(1, (now - begin) / total)
        pos.current = progress >= 1 || reduced ? to : from + distance * ease(progress)
        paint()
        if (progress < 1 && !reduced) raf.current = requestAnimationFrame(step)
        else raf.current = null
        return
      }
      const remaining = to - pos.current
      if (reduced || Math.abs(remaining) < 0.0004) {
        pos.current = to
        paint()
        raf.current = null
        return
      }
      // dt ограничен: после паузы вкладки лента не должна прыгнуть
      const dt = Math.min(now - last, 50)
      last = now
      pos.current += remaining * (1 - Math.pow(1 - tuningRef.current.settle, dt / 16.67))
      paint()
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }

  /**
   * Инерция как у колеса выбора в iOS: лента продолжает ехать с той скоростью,
   * с какой ее отпустили, и затухает по экспоненте к целой позиции. Цель
   * выбрана так, что начальная скорость доезда совпадает со скоростью пальца, —
   * разрыва между пальцем и инерцией нет
   */
  const glide = (to: number) => {
    stop()
    target.current = to
    setPosition(to)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const tau = tuningRef.current.momentumTau
    let last = performance.now()
    const step = (now: number) => {
      const remaining = to - pos.current
      if (reduced || Math.abs(remaining) < 0.0004) {
        pos.current = to
        paint()
        raf.current = null
        return
      }
      const dt = Math.min(now - last, 50)
      last = now
      pos.current += remaining * (1 - Math.exp(-dt / tau))
      paint()
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }

  const moveTo = (to: number) => {
    setPosition(to)
    settle(to)
  }
  const go = (step: number) => moveTo(Math.round(target.current) + step)
  // К баннеру по точке — коротким путем по кругу: с третьего на первый лента
  // едет на шаг вперед, а не на два назад — решение дизайнера
  const goTo = (index: number) => {
    const step = index - active
    go(step > count / 2 ? step - count : step < -count / 2 ? step + count : step)
  }

  useLayoutEffect(paint, [])
  useEffect(() => stop, [])

  const onPointerDown = (event: PointerEvent) => {
    stop()
    // Шаг ленты в пикселях берем из CSS: он разный у вариантов
    const step = parseFloat(getComputedStyle(event.currentTarget).getPropertyValue("--banner-step")) || 264
    drag.current = { x: event.clientX, pos: pos.current, step, samples: [{ t: performance.now(), pos: pos.current }] }
    target.current = pos.current
    moved.current = false
  }
  const onPointerMove = (event: PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = event.clientX - d.x
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
    if (!moved.current) return
    const now = performance.now()
    pos.current = d.pos - dx / d.step
    d.samples.push({ t: now, pos: pos.current })
    while (d.samples.length > 2 && now - d.samples[0].t > 100) d.samples.shift()
    paint()
  }
  const onPointerUp = () => {
    const d = drag.current
    if (!d) return
    drag.current = null
    if (!moved.current) {
      // Это было нажатие, лента не двигалась
      settle(Math.round(target.current))
      return
    }
    // Скорость в карточках в секунду по последним ~100 мс; палец стоял дольше — броска нет
    const first = d.samples[0]
    const now = performance.now()
    const v = now - first.t > 0 && now - d.samples[d.samples.length - 1].t < 80 ? ((pos.current - first.pos) / (now - first.t)) * 1000 : 0
    const base = Math.round(d.pos)
    const delta = pos.current - d.pos

    const { momentumTau, momentumPower, momentumMax } = tuningRef.current
    // Куда доехала бы лента, затухая с той же скоростью: путь = скорость × τ
    const thrown = Math.max(-momentumMax, Math.min(momentumMax, (v * momentumPower * momentumTau) / 1000))
    let to = Math.round(pos.current + thrown)
    // Быстрый короткий свайп (от ~40 px) листает на соседний, а не возвращает назад
    if (to === base && Math.abs(delta) > SWIPE_MIN) to = base + Math.sign(delta)
    glide(to)
  }

  return (
    <section
      className="main-hero"
      // Фон в цвет текущего баннера — hero.css по data-banner
      data-banner={banners[active].id}
      // Фон меняется только если включено в панели — по умолчанию выключено,
      // решение дизайнера: смена фона давала подвисание на смене баннера
      data-tone={tuning.toneChange && banners[active].id !== "deposit" ? "purple" : "blue"}
      data-smooth-text={tuning.smoothText || undefined}
      data-gpu={tuning.gpuLayers || undefined}
      data-lite={tuning.lite || undefined}
      // Карточки по бокам уходят в градиент, пока не выбрано «Без размытий»
      data-edge-fade={!tuning.lite || undefined}
      style={tuningStyle(tuning)}
      aria-label="Баннеры"
    >
      <div className="main-hero__bg" aria-hidden="true">
        <div className="main-hero__stage">
          {tuning.toneChange && <HeroGlow tone="purple" />}
          <HeroGlow tone="blue" />
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
        ref={trackRef}
        className="main-hero__track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slots.map((slot) => {
          // Классы — по целой цели, нужны для нажатия и скринридеров; вид баннера идет от --t
          const offset = offsetOf(slot.index, position)

          return (
            <div
              key={slot.key}
              ref={(node) => {
                slotRefs.current[slot.index] = node
              }}
              className={cx("main-hero__slot", offset === 0 && "is-active", Math.abs(offset) > 1 && "is-hidden")}
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
      </div>

      <CarouselTuning values={tuning} onChange={setTuning} />
    </section>
  )
}

/**
 * Свечение фона — три размытых пятна из макета (MobileBackground, 22797:43972).
 * SVG встроен, чтобы цвета пятен брались из hero.css по текущему баннеру и
 * плавно перетекали при смене.
 */
function HeroGlow({ tone }: { tone: "purple" | "blue" }) {
  return (
    <svg className={`main-hero__glow main-hero__glow--${tone}`} width="1254" height="954" viewBox="0 0 1254.25 954.403" fill="none">
      <g filter={`url(#main-hero-blur-60-${tone})`}>
        <path
          className="main-hero__glow-base"
          d="M895.663 277.137C934.426 421.803 808.059 581.357 613.415 633.512C418.77 685.666 229.556 610.672 190.793 466.007C152.03 321.341 287.54 193.392 482.184 141.237C676.829 89.0824 856.9 132.472 895.663 277.137Z"
        />
      </g>
      <g className="main-hero__glow-accent" filter={`url(#main-hero-blur-95-${tone})`}>
        <path d="M465.061 305.146C355.438 217.036 236.011 281.319 190 324.474L302.169 764.403C509.937 729.116 943.708 653.893 1016.64 635.297C1089.57 616.702 968.471 396.191 898.803 288.26C799.899 330.601 574.684 393.255 465.061 305.146Z" />
      </g>
      <g filter={`url(#main-hero-blur-95-${tone})`}>
        <path
          className="main-hero__glow-bright"
          d="M684.183 332.738C798.183 343.938 829.683 328.071 831.183 318.738C978.183 220.238 1285.68 656.738 805.183 523.738C324.683 390.738 541.683 318.738 684.183 332.738Z"
        />
      </g>
      <defs>
        <filter id={`main-hero-blur-60-${tone}`} x="0" y="0" width="1254.25" height="954.403" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="60" />
        </filter>
        <filter id={`main-hero-blur-95-${tone}`} x="0" y="0" width="1254.25" height="954.403" filterUnits="userSpaceOnUse">
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

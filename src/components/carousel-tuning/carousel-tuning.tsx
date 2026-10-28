import { useEffect, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"

import { cx } from "@banki/design-system"

import "./carousel-tuning.css"

/** Кривые доезда в режиме «по времени»: имя для панели и точки кривой, как в CSS */
export const EASINGS = [
  { id: "in-out", label: "Разгон и торможение", points: [0.65, 0, 0.35, 1] },
  { id: "soft", label: "Мягкая", points: [0.22, 0.61, 0.36, 1] },
  { id: "strong", label: "Резкий старт", points: [0.16, 1, 0.3, 1] },
  { id: "overshoot", label: "С перелетом", points: [0.34, 1.3, 0.64, 1] },
  { id: "linear", label: "Линейная", points: [0, 0, 1, 1] },
] as const

export type Easing = (typeof EASINGS)[number]["id"]

export type CarouselTuningValues = {
  /** «time» — доезд за заданное время по кривой, «decay» — затухание без разгона */
  mode: "time" | "decay"
  /** Режим «по времени»: сколько едет смена на целый шаг */
  duration: number
  easing: Easing
  /** Режим «затухание»: доля пути до цели за кадр (при 60 к/с) — чем меньше, тем дольше и мягче доезд */
  settle: number
  parallax: number
  /** Ширина текста баннера меняется плавно; выкл (по умолчанию) — переключается разом на середине пути, зато без пересчета строк каждый кадр */
  smoothText: boolean
  /** Инерция свайпа: время затухания, мс — чем больше, тем дольше едет лента после броска */
  momentumTau: number
  /** Инерция свайпа: сила броска — множитель скорости пальца */
  momentumPower: number
  /** Инерция свайпа: больше скольких баннеров за бросок не пролистывается */
  momentumMax: number
  /** Фон героя меняет цвет вслед за баннером: фиолетовый у «Войдите в аккаунт», синий у «Вкладов» */
  toneChange: boolean
  gpuLayers: boolean
  /** Без размытий: карточки по бокам не уходят в градиент, точки пагинации без размытия фона */
  lite: boolean
}

export const TUNING_DEFAULTS: CarouselTuningValues = {
  mode: "time",
  duration: 500,
  easing: "in-out",
  settle: 0.16,
  parallax: 12,
  smoothText: false,
  momentumTau: 100,
  momentumPower: 1,
  momentumMax: 12,
  toneChange: false,
  gpuLayers: true,
  lite: false,
}

const STORAGE_KEY = "carousel-tuning"

/** Настройки переживают перезагрузку страницы — на телефоне это удобнее, чем вбивать заново */
export function loadTuning(): CarouselTuningValues {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")
    return { ...TUNING_DEFAULTS, ...saved }
  } catch {
    return TUNING_DEFAULTS
  }
}

function saveTuning(values: CarouselTuningValues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  } catch {
    // Приватный режим или запрещенное хранилище — настройки просто не сохранятся
  }
}

/** Переменные героя из настроек. Нетронутое — как в CSS */
export function tuningStyle(values: CarouselTuningValues): CSSProperties {
  const style: Record<string, string> = {}
  // Смена цвета фона героя едет с теми же длительностью и кривой, что баннеры
  const [x1, y1, x2, y2] = (EASINGS.find((item) => item.id === values.easing) ?? EASINGS[0]).points
  style["--tone-ms"] = `${values.mode === "time" ? values.duration : 500}ms`
  style["--tone-curve"] = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
  if (values.parallax !== TUNING_DEFAULTS.parallax) style["--parallax-shift"] = `${values.parallax}px`
  return style as CSSProperties
}

/**
 * Настройки панели: читаются из localStorage, пишутся при каждом изменении.
 */
export function useCarouselTuning() {
  const [values, setValues] = useState(loadTuning)
  const update = (patch: Partial<CarouselTuningValues>) =>
    setValues((current) => {
      const next = { ...current, ...patch }
      saveTuning(next)
      return next
    })
  return [values, update] as const
}

/** Панель справа снизу: свернута в кнопку, развернута — со всеми настройками */
export function CarouselTuning({
  values,
  onChange,
}: {
  values: CarouselTuningValues
  onChange: (patch: Partial<CarouselTuningValues>) => void
}) {
  const [open, setOpen] = useState(false)

  // Порталом в body: герой липкий и лежит под белой подложкой, внутри него панель была бы закрыта
  const [host, setHost] = useState<HTMLElement | null>(null)
  useEffect(() => setHost(document.body), [])
  if (!host) return null

  return createPortal(
    <div className={cx("carousel-tuning", open && "is-open")}>
      {open ? (
        <div className="carousel-tuning__panel" role="group" aria-label="Плавность карусели">
          <div className="carousel-tuning__head">
            <span className="text-medium">Плавность карусели</span>
            <button type="button" className="carousel-tuning__link" onClick={() => onChange(TUNING_DEFAULTS)}>
              Сбросить
            </button>
            <button type="button" className="carousel-tuning__link" onClick={() => setOpen(false)}>
              Свернуть
            </button>
          </div>

          <label className="carousel-tuning__row">
            <span>Доезд при автосмене и по точкам</span>
            <select
              value={values.mode}
              onChange={(event) => onChange({ mode: event.target.value as "time" | "decay" })}
            >
              <option value="time">По времени и кривой</option>
              <option value="decay">Затухание</option>
            </select>
          </label>
          {values.mode === "time" ? (
            <>
              <Range
                label="Длительность смены"
                unit="мс"
                min={200}
                max={1500}
                step={50}
                value={values.duration}
                onChange={(duration) => onChange({ duration })}
              />
              <label className="carousel-tuning__row">
                <span>Кривая</span>
                <select value={values.easing} onChange={(event) => onChange({ easing: event.target.value as Easing })}>
                  {EASINGS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <Range
              label="Затухание доезда (автосмена, точки)"
              unit=""
              min={0.04}
              max={0.4}
              step={0.01}
              value={values.settle}
              onChange={(settle) => onChange({ settle })}
            />
          )}
          <Range
            label="Инерция: затухание"
            unit="мс"
            min={100}
            max={1200}
            step={25}
            value={values.momentumTau}
            onChange={(momentumTau) => onChange({ momentumTau })}
          />
          <Range
            label="Инерция: сила броска"
            unit="×"
            min={0.3}
            max={3}
            step={0.1}
            value={values.momentumPower}
            onChange={(momentumPower) => onChange({ momentumPower })}
          />
          <Range
            label="Инерция: максимум баннеров за бросок"
            unit=""
            min={1}
            max={30}
            step={1}
            value={values.momentumMax}
            onChange={(momentumMax) => onChange({ momentumMax })}
          />
          <Range
            label="Параллакс картинки"
            unit="px"
            min={0}
            max={96}
            step={4}
            value={values.parallax}
            onChange={(parallax) => onChange({ parallax })}
          />
          <Check
            label="Менять цвет фона"
            checked={values.toneChange}
            onChange={(toneChange) => onChange({ toneChange })}
          />
          <Check
            label="Плавная ширина текста"
            checked={values.smoothText}
            onChange={(smoothText) => onChange({ smoothText })}
          />
          <Check
            label="Слои GPU (внутри баннеров)"
            checked={values.gpuLayers}
            onChange={(gpuLayers) => onChange({ gpuLayers })}
          />
          <Check
            label="Без размытий (края карточек, точки пагинации)"
            checked={values.lite}
            onChange={(lite) => onChange({ lite })}
          />
        </div>
      ) : (
        <button type="button" className="carousel-tuning__fab" onClick={() => setOpen(true)}>
          Плавность · {values.mode === "time" ? `${values.duration} мс` : values.settle}
        </button>
      )}
    </div>,
    host,
  )
}

function Range({
  label,
  unit,
  value,
  onChange,
  ...range
}: {
  label: string
  unit: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="carousel-tuning__row carousel-tuning__row--range">
      <span>
        {label}: {value} {unit}
      </span>
      <input type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} {...range} />
    </label>
  )
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="carousel-tuning__row carousel-tuning__row--check">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

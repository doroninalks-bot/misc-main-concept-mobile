/**
 * Содержимое доски канваса (`/canvas`). Единственное место, которое правят под
 * конкретный прототип: сама доска — из дизайн-системы (`src/canvas.tsx`).
 * Что можно описать — типы `CanvasItem` и остальные в
 * `node_modules/@banki/design-system/src/canvas/types.ts`.
 *
 * Файл обновляется вместе с каждым экраном, а не по отдельной просьбе: новый
 * экран — новый шаг, новое состояние экрана — новая рамка под тем же шагом.
 * Порядок шагов повторяет сценарий респондента.
 */

import { MOBILE, type CanvasItem } from "@banki/design-system/canvas"

import { banners } from "./main"

/** Рамка телефона высотой 628 — как рамки макета в Фигме, решение дизайнера */
const PHONE = { ...MOBILE, height: 628 }

/** Рамки варианта: баннеры меняются сами, затем каждый баннер по центру — `?slide=` */
function bannerStates(route: string) {
  return [
    { title: "Баннеры меняются", frames: [{ route, label: "Mobile", ...PHONE }] },
    ...banners.map((banner) => ({
      title: `Баннер «${banner.title.replace(/\s+/g, " ")}»`,
      frames: [{ route: `${route}?slide=${banner.id}`, label: "Mobile", ...PHONE }],
    })),
  ]
}

export const scenarios: CanvasItem[] = [
  {
    title: "Главная, мобильный концепт",
    description:
      "Баннеры каруселью по центру: сами меняются каждые 6 секунд, едут и увеличиваются; листаются нажатием на соседний и свайпом по инерции, как колесо выбора времени в iOS: сильный бросок пролистывает сразу несколько баннеров.",
    steps: [
      { title: "Вариант 1: фон меняет цвет", note: "Интерактив", states: bannerStates("/") },
      { title: "Вариант 2: фон всегда синий", note: "Интерактив", states: bannerStates("/main-v2") },
    ],
  },
]

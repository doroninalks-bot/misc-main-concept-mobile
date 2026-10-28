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

/** Рамка телефона высотой 628 — как рамки макета в Фигме, решение дизайнера */
const PHONE = { ...MOBILE, height: 628 }

export const scenarios: CanvasItem[] = [
  {
    title: "Главная, мобильный концепт",
    description:
      "Баннеры каруселью по центру: сами меняются каждые 6 секунд, едут и увеличиваются; листаются нажатием на соседний и свайпом по инерции, как колесо выбора времени в iOS: сильный бросок пролистывает сразу несколько баннеров.",
    steps: [
      {
        title: "Главная",
        note: "Интерактив",
        states: [
          { title: "Баннеры меняются", frames: [{ route: "/", label: "Mobile", ...PHONE }] },
          { title: "Баннер «Войдите в аккаунт»", frames: [{ route: "/?slide=account", label: "Mobile", ...PHONE }] },
          { title: "Баннер «Вклад», синий", frames: [{ route: "/?slide=deposit", label: "Mobile", ...PHONE }] },
          { title: "Баннер «Вклад», серый", frames: [{ route: "/?slide=deposit-grey", label: "Mobile", ...PHONE }] },
        ],
      },
    ],
  },
]

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
      "Баннеры каруселью по центру: сами меняются каждые 6 секунд, едут и увеличиваются; листаются свайпом и нажатием на соседний. Соседние не размыты.",
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
  {
    title: "Главная, вариант 3: лента с наклоном",
    description:
      "Баннеры лентой с наклоном: соседние повернуты в 3D к центру, при смене лента едет и карточки разворачиваются. Экран /main-v3.",
    steps: [
      {
        title: "Главная",
        note: "Интерактив",
        states: [
          { title: "Баннеры меняются", frames: [{ route: "/main-v3", label: "Mobile", ...PHONE }] },
          {
            title: "Баннер «Войдите в аккаунт»",
            frames: [{ route: "/main-v3?slide=account", label: "Mobile", ...PHONE }],
          },
        ],
      },
    ],
  },
  {
    title: "Главная, вариант 4: размыта иллюстрация",
    description:
      "Та же карусель, что на главной, но у соседних баннеров размыта только иллюстрация: текст и цвет четкие. Экран /main-v4.",
    steps: [
      {
        title: "Главная",
        note: "Интерактив",
        states: [
          { title: "Баннеры меняются", frames: [{ route: "/main-v4", label: "Mobile", ...PHONE }] },
          {
            title: "Баннер «Войдите в аккаунт»",
            frames: [{ route: "/main-v4?slide=account", label: "Mobile", ...PHONE }],
          },
        ],
      },
    ],
  },
]

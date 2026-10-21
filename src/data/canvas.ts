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

import { DESKTOP, MOBILE, type CanvasItem } from "@banki/design-system/canvas"

export const scenarios: CanvasItem[] = [
  {
    title: "Название сценария",
    description: "Одно-два предложения: что за сценарий и что на доске.",
    steps: [
      {
        title: "Первый экран",
        note: "Интерактив",
        states: [
          {
            frames: [
              { route: "/", label: "Mobile", ...MOBILE },
              { route: "/", label: "Desktop", ...DESKTOP },
            ],
          },
        ],
      },
      // Следующий шаг сценария. Несколько состояний одного шага — несколько
      // объектов в states: они встают друг под другом.
      // {
      //   title: "Подтверждение",
      //   states: [
      //     { title: "Пустое", frames: [{ route: "/confirm", label: "Mobile", ...MOBILE }] },
      //     { title: "Ошибка", frames: [{ route: "/confirm?state=error", label: "Mobile", ...MOBILE }] },
      //   ],
      // },
    ],
  },
]

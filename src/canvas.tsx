/**
 * Канвас (`/canvas`) — доска из дизайн-системы, `@banki/design-system/canvas`.
 * Прототип передает ей только свои сценарии, `src/data/canvas.ts`. Правки
 * доски — пулл-реквестом в дизайн-систему: так они приходят во все прототипы.
 */

import { CanvasPage } from "@banki/design-system/canvas"

import { scenarios } from "@/data/canvas"

export default function Canvas() {
  return <CanvasPage scenarios={scenarios} />
}

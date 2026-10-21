import path from "node:path"
import { fileURLToPath } from "node:url"

import { designSystem } from "@banki/design-system/vite"
import react from "@vitejs/plugin-react"
import ts from "typescript"
import { defineConfig, type Plugin } from "vite"

const root = path.dirname(fileURLToPath(import.meta.url))
const SRC_DIR = path.join(root, "src")

/**
 * Место в коде у каждого элемента — для выбора элемента на канвасе: клик по
 * кнопке в рамке копирует, в каком файле и строке она написана. Каждому тегу
 * в `.tsx` из `src/` дописывается `data-loc="src/…/file.tsx:42"`: у тегов
 * страницы — атрибутом в DOM, у компонентов — пропсом, его канвас читает из
 * React (`element-picker.tsx` канваса в дизайн-системе). Атрибут ставится последним: если
 * компонент раздает свои пропсы на тег (`<button {...props}>`), у тега остается
 * свое место, а не место вызова компонента. Код только дописывается внутри
 * строки — номера строк в отладчике не сдвигаются. Работает и в сборке для
 * Vercel: канвас на проде копирует то же самое.
 */
const sourceLocations = (): Plugin => ({
  name: "source-locations",
  enforce: "pre",
  transform(code, id) {
    const file = id.split("?")[0]
    if (!file.endsWith(".tsx") || !file.startsWith(SRC_DIR)) return
    const relative = path.relative(root, file).split(path.sep).join("/")
    const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX)
    const inserts: { at: number; text: string }[] = []
    const visit = (node: ts.Node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        // Fragment лишних пропсов не принимает. У <Foo<T>> без атрибутов
        // атрибут встал бы внутрь <T> — такие пропускаем
        const tag = node.tagName.getText(source)
        const hasAttributes = node.attributes.properties.length > 0
        if (!/(^|\.)Fragment$/.test(tag) && (hasAttributes || !node.typeArguments)) {
          const { line } = source.getLineAndCharacterOfPosition(node.getStart(source))
          const at = hasAttributes ? node.attributes.end : node.tagName.end
          inserts.push({ at, text: ` data-loc="${relative}:${line + 1}"` })
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    if (!inserts.length) return
    let result = code
    // С конца файла: вставка не сдвигает места следующих. Порядок обхода не годится —
    // у <Tile icon={<Icon />}> место родителя (конец атрибутов) дальше, чем у вложенного
    inserts.sort((a, b) => b.at - a.at)
    for (const { at, text } of inserts) result = result.slice(0, at) + text + result.slice(at)
    return { code: result, map: null }
  },
})

export default defineConfig({
  // designSystem() — иконки, иллюстрации и шрифты дизайн-системы по адресам /assets/...
  // и сведения для канваса: имя прототипа, адрес в Wi-Fi
  plugins: [sourceLocations(), react(), designSystem()],
  resolve: {
    alias: { "@": path.join(root, "src") },
  },
  server: {
    // Network-адрес в терминале — чтобы открыть прототип на телефоне в той же Wi-Fi
    host: true,
    port: Number(process.env.PORT) || 5173,
    allowedHosts: true,
  },
  preview: {
    host: true,
  },
})
